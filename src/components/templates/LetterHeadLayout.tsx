import React from 'react';

const LOGO_SRC = '/images/logo_infinity.png';

/* Colours sampled from updated_letter_head.pdf */
const TEAL = '#0B8A7F';
const BLUE = '#2E6DB4';
const NAVY = '#1F3A8A';

interface LetterHeadLayoutProps {
    children: React.ReactNode;
}

/**
 * Letterhead wrapper – exact A4 (210mm x 297mm) replica of updated_letter_head.pdf
 *
 *  • Header  – centred logo, full-width teal line with a centred blue bar
 *  • Body    – content area with a faint centred watermark logo
 *  • Footer  – navy line, bold address, teal email, solid navy band at page bottom
 *
 * Usage:
 *   <LetterHeadLayout>
 *       {/* your letter body content *\/}
 *   </LetterHeadLayout>
 */
export const LetterHeadLayout: React.FC<LetterHeadLayoutProps> = ({ children }) => {
    return (
        <>
            <style>{`
                @page { size: A4 portrait; margin: 0; }
                @media print {
                    html, body { margin: 0; padding: 0; }
                    .letterhead-page {
                        box-shadow: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            <div
                className="letterhead-page"
                style={{
                    position: 'relative',
                    isolation: 'isolate',
                    boxSizing: 'border-box',
                    width: '210mm',
                    minHeight: '297mm',
                    maxWidth: '100%',
                    margin: '0 auto',
                    background: '#fff',
                    color: '#000',
                    boxShadow: '0 1px 6px rgba(0,0,0,.25)',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: '11pt',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* ── WATERMARK ─────────────────────────── */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                >
                    <img
                        src={LOGO_SRC}
                        alt=""
                        style={{
                            width: '67%',
                            objectFit: 'contain',
                            opacity: 0.25,
                            userSelect: 'none',
                        }}
                    />
                </div>

                {/* ── HEADER ────────────────────────────── */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        flex: '0 0 auto',
                        height: '47mm',
                        boxSizing: 'border-box',
                        paddingTop: '12mm',
                        textAlign: 'center',
                    }}
                >
                    <img
                        src={LOGO_SRC}
                        alt="Infinity Arthvishva"
                        style={{
                            height: '26mm',
                            width: 'auto',
                            objectFit: 'contain',
                            display: 'inline-block',
                        }}
                    />

                    {/* full-width teal line */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: '0.8mm',
                            background: TEAL,
                        }}
                    />
                    {/* centred blue bar on the line */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '30%',
                            width: '40%',
                            bottom: '-0.6mm',
                            height: '2mm',
                            background: BLUE,
                        }}
                    />
                </div>

                {/* ── BODY ──────────────────────────────── */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        flex: 1,
                        padding: '10mm 14mm',
                        overflowX: 'hidden',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                >
                    {children}
                </div>

                {/* ── FOOTER ────────────────────────────── */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        flex: '0 0 auto',
                        height: '26mm',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                        fontFamily: '"Open Sans", "Segoe UI", Arial, Helvetica, sans-serif',
                        backgroundColor: 'transparent',
                    }}
                >
                    {/* System-generated disclaimer */}
                    <p
                        style={{
                            margin: '0 0 1.8mm 0',
                            padding: '0 10mm',
                            fontSize: '7.5pt',
                            fontStyle: 'italic',
                            color: '#4B5563',
                            lineHeight: 1.25,
                        }}
                    >
                        This is a system-generated letter and is issued electronically; therefore, no physical signature or company stamp is required.
                    </p>

                    {/* top navy dividing line */}
                    <div
                        style={{
                            height: '0.8mm',
                            background: NAVY,
                            width: '100%',
                            marginBottom: '1.8mm',
                        }}
                    />

                    <p
                        style={{
                            margin: 0,
                            padding: '0 12mm',
                            fontSize: '8pt',
                            fontWeight: 700,
                            lineHeight: 1.45,
                            color: '#000',
                        }}
                    >
                        1201 , 12th floor,7 Business Square By Naiknavare , Ganeshkhind Rd , Near Data Mandir ,
                        <br />
                        Model colony , Shivajinagar , Pune , Maharashtra 411041
                    </p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '7.5pt',
                            fontWeight: 700,
                            lineHeight: 1.4,
                            color: TEAL,
                        }}
                    >
                        admin@infinityarthvishva.com
                    </p>

                    {/* solid navy band at the very bottom */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: '3.2mm',
                            background: NAVY,
                        }}
                    />
                </div>
            </div>
        </>
    );
};