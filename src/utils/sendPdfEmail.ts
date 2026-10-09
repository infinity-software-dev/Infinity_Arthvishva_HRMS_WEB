import { toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';
import { letterService } from '@/services/letter.service';

// ── A4 dimensions at 96 dpi ───────────────────────────────────────────────────
export const A4_W = 794;  // px  (210 mm)
export const A4_H = 1123; // px  (297 mm)

// LetterHeadLayout fixed heights (LetterHeadLayout.tsx inline styles)
export const HEADER_H = Math.round(47 * A4_W / 210); // 178 px
export const FOOTER_H = Math.round(26 * A4_W / 210); // 98  px
export const BODY_H = A4_H - HEADER_H - FOOTER_H;    // 847 px per page

// Body padding: top & bottom
export const BODY_PAD_TOP = 46; // px (comfortable breathing margin below header on continuation pages)
export const BODY_PAD_BOTTOM = Math.round(10 * A4_W / 210); // 38 px

export interface GeneratedDocument {
  pdf: jsPDF;
  pdfBlob: Blob;
  pageImages: string[];
  pageCount: number;
}

export interface PageSlice {
  srcY: number;
  srcH: number;
  destPadTop: number; // Top padding on target page (38px on page 2+ for clean margin below header)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cropCanvas(
  src: HTMLCanvasElement,
  sx: number, sy: number, sw: number, sh: number,
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = sw; c.height = sh;
  c.getContext('2d')!.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
  return c;
}

/** Pre-load an image once. Returns null on failure. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Wait for all <img> tags inside an element to be fully loaded */
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalHeight > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
      });
    })
  );
}

/** Get element offsetTop relative to a container */
function getOffsetTop(el: HTMLElement, container: HTMLElement): number {
  let top = 0;
  let curr: HTMLElement | null = el;
  while (curr && curr !== container) {
    top += curr.offsetTop;
    curr = curr.offsetParent as HTMLElement | null;
  }
  return top;
}

/** Check if element is a point heading or section header */
function isPointHeading(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase();
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return true;

  const cls = (el.className || '').toString();
  if (
    cls.includes('io-h') ||
    cls.includes('ap-h') ||
    cls.includes('hf-section') ||
    cls.includes('af-section') ||
    cls.includes('NumHead') ||
    cls.includes('heading')
  ) {
    return true;
  }

  const text = (el.innerText || el.textContent || '').trim();
  // Numbered points like "1.", "2.", "7.", or section titles like "EMAIL / LOGIN / PASSWORD HANDOVER:"
  if (/^(\d+\.|\bAnnexure\b|\bSection\b|[A-Z\s\/]{3,}:)/.test(text)) {
    return true;
  }

  return false;
}

/**
 * Finds a row of pure white pixels in the canvas above targetY.
 * Used to cut pages cleanly in the empty whitespace between elements so text is never sliced.
 */
function findBlankRowAbove(
  ctx: CanvasRenderingContext2D,
  targetY: number,
  lookback: number = 60,
): number {
  const startX = 60;
  const sampleW = A4_W - 120;
  const clampedTargetY = Math.round(targetY);

  for (let y = clampedTargetY - 5; y >= Math.max(0, clampedTargetY - lookback); y--) {
    const imgData = ctx.getImageData(startX, y, sampleW, 1).data;
    let isBlank = true;
    for (let i = 0; i < imgData.length; i += 16) {
      if (imgData[i] < 235 || imgData[i + 1] < 235 || imgData[i + 2] < 235) {
        isBlank = false;
        break;
      }
    }
    if (isBlank) return y;
  }

  return Math.max(0, clampedTargetY - 15);
}

/**
 * Intelligent point-aware page slicer:
 * 1. Recognizes explicit breaks (.ap-newpage), points, form sections (.hf-section), tables, and rows.
 * 2. If a point, table, or section doesn't fit on the current page, it cuts in the blank gap BEFORE it
 *    and takes the entire point down to the next page.
 */
function findPointAwareSlices(
  letterEl: HTMLElement,
  contentCanvas: HTMLCanvasElement,
  contentH: number,
): PageSlice[] {
  const slices: PageSlice[] = [];
  const ctx = contentCanvas.getContext('2d', { willReadFrequently: true })!;

  // Collect all potential break elements inside the letter
  const candidateNodes = Array.from(
    letterEl.querySelectorAll<HTMLElement>(
      '.ap-newpage, .break-before-page, .io-h, .ap-h, .hf-section, .af-section, .io-avoid, .ap-avoid, .hf-avoid, .af-avoid, .nd-avoid, h1, h2, h3, h4, table, tr, p, div'
    )
  );

  interface BreakUnit {
    top: number;
    bottom: number;
    isExplicit: boolean;
    isHeading: boolean;
  }

  const units: BreakUnit[] = [];

  candidateNodes.forEach((node) => {
    const isExplicit =
      node.classList.contains('ap-newpage') ||
      node.classList.contains('break-before-page') ||
      (node.getAttribute('style') || '').includes('break-before') ||
      (node.getAttribute('style') || '').includes('page-break-before');

    const isHeading = isPointHeading(node);
    const isTable = node.tagName.toLowerCase() === 'table';
    const isTableRow = node.tagName.toLowerCase() === 'tr';
    const cls = (node.className || '').toString();
    const styleAttr = (node.getAttribute('style') || '').toString();
    const isAvoid =
      cls.includes('avoid') ||
      styleAttr.includes('avoid');

    const hasAvoidAncestor = Boolean(
      node.parentElement?.closest('[class*="avoid"], [style*="avoid"]')
    );

    if ((isExplicit || isHeading || isTable || isTableRow || isAvoid) && !hasAvoidAncestor) {
      const top = getOffsetTop(node, letterEl);
      let bottom = top + node.offsetHeight;

      // If it's a heading (e.g. "EMAIL / LOGIN / PASSWORD HANDOVER:"),
      // extend bottom to include its following table or body content
      if (isHeading && node.nextElementSibling) {
        const next = node.nextElementSibling as HTMLElement;
        bottom = Math.max(bottom, getOffsetTop(next, letterEl) + next.offsetHeight);
      }

      if (top > HEADER_H + 20 && top < contentH - FOOTER_H) {
        units.push({ top, bottom, isExplicit, isHeading });
      }
    }
  });

  units.sort((a, b) => a.top - b.top);

  let currentSrcY = HEADER_H;
  const maxContentY = contentH - FOOTER_H;

  while (currentSrcY < maxContentY - 20) {
    const remainingH = maxContentY - currentSrcY;
    if (remainingH <= BODY_H) {
      slices.push({
        srcY: currentSrcY,
        srcH: remainingH,
        destPadTop: slices.length === 0 ? 0 : BODY_PAD_TOP,
      });
      break;
    }

    // Maximum bottom coordinate this page can accept before the footer
    const maxPageBottomY = currentSrcY + BODY_H - (slices.length === 0 ? 45 : 60);

    let chosenCutY = maxPageBottomY;
    let nextStartSrcY = maxPageBottomY;
    let found = false;

    for (let u = 0; u < units.length; u++) {
      const unit = units[u];
      if (unit.top <= currentSrcY + 50) continue;

      // 1. Explicit break (.ap-newpage) - always break cleanly before it!
      if (unit.isExplicit && unit.top <= maxPageBottomY + 80) {
        chosenCutY = findBlankRowAbove(ctx, unit.top, 80);
        nextStartSrcY = chosenCutY;
        found = true;
        break;
      }

      // 2. Heading or point unit whose bottom overflows the page - take the ENTIRE point down!
      if (unit.bottom > maxPageBottomY && unit.top > currentSrcY + 120) {
        chosenCutY = findBlankRowAbove(ctx, unit.top, 80);
        nextStartSrcY = chosenCutY;
        found = true;
        break;
      }
    }

    if (!found) {
      chosenCutY = findBlankRowAbove(ctx, maxPageBottomY, 80);
      nextStartSrcY = chosenCutY;
    }

    const srcH = Math.max(50, chosenCutY - currentSrcY);
    slices.push({
      srcY: currentSrcY,
      srcH,
      destPadTop: slices.length === 0 ? 0 : BODY_PAD_TOP,
    });

    currentSrcY = nextStartSrcY;
  }

  if (slices.length === 0) {
    slices.push({
      srcY: HEADER_H,
      srcH: Math.min(BODY_H, maxContentY - HEADER_H),
      destPadTop: 0,
    });
  }

  return slices;
}

/**
 * Builds a single full A4 page canvas:
 * 1. Base white background
 * 2. Header (rows 0 → HEADER_H)
 * 3. Footer (rows contentH - FOOTER_H → contentH)
 * 4. Watermark centered in body area (20% opacity)
 * 5. Body slice drawn with multiply blend mode and proper top padding
 */
function buildFullPageCanvas(
  contentCanvas: HTMLCanvasElement,
  contentH: number,
  srcY: number,
  srcH: number,
  destPadTop: number,
  logo: HTMLImageElement | null,
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = A4_W;
  c.height = A4_H;
  const ctx = c.getContext('2d')!;

  // 1. Base white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, A4_W, A4_H);

  // 2. Header
  ctx.drawImage(contentCanvas, 0, 0, A4_W, HEADER_H, 0, 0, A4_W, HEADER_H);

  // 3. Footer
  ctx.drawImage(
    contentCanvas,
    0, contentH - FOOTER_H, A4_W, FOOTER_H,
    0, A4_H - FOOTER_H, A4_W, FOOTER_H,
  );

  // 4. Centred watermark in body area (HEADER_H to A4_H - FOOTER_H)
  if (logo) {
    const wmW = A4_W * 0.65;
    const wmH = wmW * (logo.naturalHeight / logo.naturalWidth);
    const wmX = (A4_W - wmW) / 2;
    const wmY = HEADER_H + (BODY_H - wmH) / 2;
    ctx.save();
    ctx.globalAlpha = 0.20;
    ctx.drawImage(logo, wmX, wmY, wmW, wmH);
    ctx.restore();
  }

  // 5. Body content with multiply blend
  if (srcH > 0) {
    const slice = cropCanvas(contentCanvas, 0, srcY, A4_W, srcH);
    const paddedSlice = document.createElement('canvas');
    paddedSlice.width = A4_W;
    paddedSlice.height = BODY_H;
    const pCtx = paddedSlice.getContext('2d')!;
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, A4_W, BODY_H);

    // destPadTop gives comfortable breathing room below header line on page 2+
    pCtx.drawImage(slice, 0, destPadTop);

    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(paddedSlice, 0, HEADER_H);
    ctx.restore();
  }

  return c;
}

/**
 * Generates exact multi-page PDF document and array of A4 page image dataURLs.
 * Used for both accurate multi-page preview in UI and for sending/downloading PDF.
 */
export const generateLetterPages = async (
  elementOrId: string | HTMLElement,
): Promise<GeneratedDocument> => {
  const container =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!container) throw new Error(`Element '${elementOrId}' not found.`);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'a4',
    compress: true,
  });

  const PW = pdf.internal.pageSize.getWidth();
  const PH = pdf.internal.pageSize.getHeight();

  // If template defines multiple .letterhead-page elements directly
  const pageEls = Array.from(container.querySelectorAll<HTMLElement>('.letterhead-page'));
  if (pageEls.length > 1) {
    const pageImages: string[] = [];
    for (let i = 0; i < pageEls.length; i++) {
      const pageEl = pageEls[i];
      await waitForImages(pageEl);
      const canvas = await toCanvas(pageEl, {
        pixelRatio: 1,
        backgroundColor: '#ffffff',
        width: A4_W,
        height: A4_H,
        style: { boxShadow: 'none', margin: '0', border: 'none' },
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      pageImages.push(dataUrl);
      if (i > 0) pdf.addPage();
      pdf.addImage(dataUrl, 'JPEG', 0, 0, PW, PH);
    }

    const pdfBlob = pdf.output('blob');
    return {
      pdf,
      pdfBlob,
      pageImages,
      pageCount: pageEls.length,
    };
  }

  const letterEl = pageEls[0] ?? container;

  // Wait for all images inside template to load
  await waitForImages(letterEl);

  const contentH = letterEl.scrollHeight || A4_H;

  // Pre-load watermark logo
  const logo = await loadImage('/images/logo_infinity.png');

  // Capture full content without watermark (watermark is cleanly added per page)
  const contentCanvas = await toCanvas(letterEl, {
    pixelRatio: 1,
    backgroundColor: '#ffffff',
    width: A4_W,
    height: contentH,
    filter: (node: HTMLElement) => {
      if (typeof node.getAttribute === 'function') {
        if (node.getAttribute('aria-hidden') === 'true') return false;
        if (node.classList?.contains('letterhead-watermark')) return false;
      }
      return true;
    },
    style: { boxShadow: 'none', margin: '0', border: 'none' },
  });

  // Intelligent point-aware page slicer: cuts in blank gap before the point and takes the entire point down
  const slices = findPointAwareSlices(letterEl, contentCanvas, contentH);
  const pageImages: string[] = [];

  slices.forEach((slice, pageIdx) => {
    if (pageIdx > 0) pdf.addPage();

    const pageCanvas = buildFullPageCanvas(
      contentCanvas,
      contentH,
      slice.srcY,
      slice.srcH,
      slice.destPadTop,
      logo,
    );
    const pageDataUrl = pageCanvas.toDataURL('image/jpeg', 0.95);

    pageImages.push(pageDataUrl);
    pdf.addImage(pageDataUrl, 'JPEG', 0, 0, PW, PH);
  });

  const pdfBlob = pdf.output('blob');

  return {
    pdf,
    pdfBlob,
    pageImages,
    pageCount: slices.length,
  };
};

// ── Main send export ─────────────────────────────────────────────────────────

export const sendPdfEmail = async (
  elementOrBlob: string | HTMLElement | Blob,
  recipientEmail: string,
  filename: string = 'Document.pdf',
  subject?: string,
  text?: string,
) => {
  try {
    let pdfBlob: Blob;

    if (elementOrBlob instanceof Blob) {
      pdfBlob = elementOrBlob;
    } else {
      const generated = await generateLetterPages(elementOrBlob);
      pdfBlob = generated.pdfBlob;
    }

    const formData = new FormData();
    formData.append('file', pdfBlob, filename);
    formData.append('email', recipientEmail);
    if (subject) formData.append('subject', subject);
    if (text) formData.append('text', text);

    const responseData = await letterService.sendLetterEmail(formData);
    console.log('Email sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending PDF email:', error);
    throw error;
  }
};
