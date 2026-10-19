import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Download } from "lucide-react";
import { FormInput } from "@/components/elements/FormFields";

import { OfferLetterTemplate } from "@/components/templates/letters/OfferLetterTemplate";
import { InternshipOfferLetterTemplate } from "@/components/templates/letters/InternshipOfferLetter";
import { AppointmentLetterTemplate } from "@/components/templates/letters/AppoiontmentLetterTemplate";
import { ConfirmationLetterTemplate } from "@/components/templates/letters/ConfirmationLetterTemplate";
import { IncrementLetterTemplate } from "@/components/templates/letters/IncrementLetterTemplate";
import { ExperienceLetterTemplate } from "@/components/templates/letters/ExperienceLetterTemplate";
import { InternshipExperienceLetterTemplate } from "@/components/templates/letters/InternshipExperinceLetterTemplate";
import { RelivingLetterTemplate } from "@/components/templates/letters/RelivingLetterTemplate";
import { WarningLetterTemplate } from "@/components/templates/letters/WarningLetterTemplate";
import { AssetsIssueFormTemplate } from "@/components/templates/forms/AssetsIssueFormTemplate";
import { EmployeeHandoverFormTemplate } from "@/components/templates/forms/EmployeeHandoverFormTemplate";
import { NoDuesFormTemplate } from "@/components/templates/forms/NoDuesFormTemplate";
import { useSendLetterEmail } from "@/hooks/letter-hooks/useSendLetterEmail";
import { generateLetterPages } from "@/utils/sendPdfEmail";

interface DynamicLetterPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    data: any;
    selectedLetter: string;
}

export const DynamicLetterPreviewModal: React.FC<
    DynamicLetterPreviewModalProps
> = ({ isOpen, onClose, onSuccess, data, selectedLetter }) => {
    const initialEmail = data?.email || data?.candidateEmail || data?.employeeEmail || "";
    const [email, setEmail] = useState(initialEmail);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [pageImages, setPageImages] = useState<string[]>([]);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(true);
    
    useEffect(() => {
        setEmail(data?.email || data?.candidateEmail || data?.employeeEmail || "");
    }, [data]);
    
    useEffect(() => {
        setSubject(`Important: ${selectedLetter} from Infinity Arthvishva`);
        setMessage(`Hello,\n\nPlease find your ${selectedLetter} attached to this email.\n\nBest Regards,\nHR Team\nInfinity Arthvishva`);
    }, [selectedLetter]);

    useEffect(() => {
        if (isOpen && data) {
            setIsGeneratingPreview(true);
            setPageImages([]);
            setPdfBlobUrl(null);
            
            // Give DOM time to mount the hidden template before capturing
            setTimeout(async () => {
                try {
                    const result = await generateLetterPages("pdf-preview-content-hidden");
                    setPageImages(result.pageImages);
                    setPdfBlobUrl(URL.createObjectURL(result.pdfBlob));
                } catch (err) {
                    console.error("Preview generation failed:", err);
                } finally {
                    setIsGeneratingPreview(false);
                }
            }, 800); 
        }
    }, [isOpen, data, selectedLetter]);

    const { sendEmail, isSending, isSent, error } = useSendLetterEmail();

    if (!isOpen || !data) return null;

    const handleSend = async () => {
        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        const success = await sendEmail(
            "pdf-preview-content-hidden",
            email,
            `${selectedLetter}.pdf`,
            subject,
            message,
        );

        if (success) {
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    onClose();
                }
            }, 2000);
        } else {
            alert("Failed to send email. Check console for details.");
        }
    };

    const renderTemplate = () => {
        switch (selectedLetter) {
            case "Offer Letter": return <OfferLetterTemplate data={data} annexure={data?.annexure ?? null} />;
            case "Internship Offer Letter": return <InternshipOfferLetterTemplate data={data} />;
            case "Appointment Letter": return <AppointmentLetterTemplate data={data} annexureB={data?.annexureB ?? null} />;
            case "Confirmation Letter": return <ConfirmationLetterTemplate data={data} />;
            case "Increment Letter": return <IncrementLetterTemplate data={data} annexure={data?.annexure ?? null} />;
            case "Experience Letter": return <ExperienceLetterTemplate data={data} />;
            case "Internship Experience Letter": return <InternshipExperienceLetterTemplate data={data} />;
            case "Relieving Letter": return <RelivingLetterTemplate data={data} />;
            case "Warning Letter": return <WarningLetterTemplate data={data} />;
            case "Asset Issue Form": return <AssetsIssueFormTemplate data={data} />;
            case "Handover Form": return <EmployeeHandoverFormTemplate data={data} />;
            case "No Dues Form": return <NoDuesFormTemplate data={data} />;
            default: return <p className="text-center p-4">Preview not available</p>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white dark:bg-[#16101B] rounded-2xl shadow-xl w-full max-w-4xl border border-secondary/20 dark:border-secondary/30 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-secondary/15 dark:border-secondary/20 shrink-0">
                    <h2 className="text-xl font-bold text-primary dark:text-white">
                        {selectedLetter} Preview
                    </h2>
                    <div className="flex items-center gap-4">
                        {pdfBlobUrl && (
                            <a
                                href={pdfBlobUrl}
                                download={`${selectedLetter.replace(/\s+/g, '_')}.pdf`}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 rounded-xl text-sm font-semibold transition-colors"
                            >
                                <Download size={16} />
                                <span>Download PDF</span>
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="text-secondary/70 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-[#0a070e] flex flex-col items-center gap-6 relative">
                    
                    {/* Rendered off-screen: html-to-image can capture it, but user never sees it while scrolling */}
                    <div style={{
                        position: 'fixed',
                        left: '-99999px',
                        top: 0,
                        width: '794px',
                        zIndex: -1,
                        pointerEvents: 'none',
                        display: pageImages.length > 0 ? 'none' : 'block',
                    }}>
                        <div id="pdf-preview-content-hidden">
                            {renderTemplate()}
                        </div>
                    </div>

                    {isGeneratingPreview && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/95 dark:bg-[#0a070e]/95 text-secondary dark:text-gray-400 rounded-xl">
                            <Loader2 size={32} className="animate-spin mb-4 text-brand-blue" />
                            <p className="font-medium text-sm">Generating PDF Preview...</p>
                        </div>
                    )}

                    {!isGeneratingPreview && pageImages.length > 0 && (
                        pageImages.map((src, i) => (
                            <img 
                                key={i} 
                                src={src} 
                                alt={`Page ${i + 1}`} 
                                className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-sm relative z-0" 
                                style={{ width: '210mm', maxWidth: '100%', backgroundColor: 'white' }} 
                            />
                        ))
                    )}
                    
                    {!isGeneratingPreview && pageImages.length === 0 && (
                        <p className="text-center p-4 text-red-500 relative z-0">Failed to load preview. Please try again.</p>
                    )}
                </div>

                <div className="p-6 border-t border-secondary/15 dark:border-secondary/20 shrink-0 bg-white dark:bg-[#16101B]">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 w-full">
                                <FormInput
                                    label="Recipient Email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="candidate@example.com"
                                    textTransform="lowercase"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <FormInput
                                    label="Subject"
                                    name="subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter email subject"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-secondary dark:text-gray-300 mb-1.5">
                                Email Message / Body
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 text-sm border border-secondary/20 dark:border-secondary/30 rounded-xl bg-transparent text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                                placeholder="Enter the email message..."
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 w-full mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-secondary dark:text-gray-300 hover:bg-secondary/10 dark:hover:bg-secondary/20 rounded-xl transition-colors cursor-pointer w-full md:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={isSending || isSent || !email || isGeneratingPreview}
                                className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm w-full md:w-auto ${isSent ? "bg-green-500 hover:bg-green-600" : "bg-brand-blue hover:bg-brand-blue/90"} disabled:opacity-60 cursor-pointer`}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : isSent ? (
                                    <span>Sent!</span>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Letter</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
