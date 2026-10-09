"use client";

import { useState } from 'react';
import { useLetters } from '@/hooks/letter-hooks/useLetters';
import { OfferLetterForm } from '@/components/letterForms/letters/OfferLetterForm';
import { InternshipOfferLetterForm } from '@/components/letterForms/letters/InternshipOfferLetterForm';
import { AppointmentLetterForm } from '@/components/letterForms/letters/AppointmentLetterForm';
import { ConfirmationLetterForm } from '@/components/letterForms/letters/ConfirmationLetterForm';
import { IncrementLetterForm } from '@/components/letterForms/letters/IncrementLetterForm';
import { ExperienceLetterForm } from '@/components/letterForms/letters/ExperienceLetterForm';
import { RelievingLetterForm } from '@/components/letterForms/letters/RelievingLetterForm';
import { WarningLetterForm } from '@/components/letterForms/letters/WarningLetterForm';
import { DynamicLetterPreviewModal } from '@/components/modals/DynamicLetterPreviewModal';
import { AssetsIssueForm } from '@/components/letterForms/forms/AssetsIssueForm';
import { EmployeeHandoverForm } from '@/components/letterForms/forms/EmployeeHandoverForm';
import { NoDuesForm } from '@/components/letterForms/forms/NoDuesForm';
export default function LettersPage() {
    const {
        selectedLetter,
        setSelectedLetter,
        selectedForm,
        setSelectedForm,
        letterTypes,
        formTypes
    } = useLetters();

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [offerLetterData, setOfferLetterData] = useState<any>(null);
    const [formKey, setFormKey] = useState(0);

    const handleOfferLetterSubmit = (data: any) => {
        setOfferLetterData(data);
        setIsPreviewModalOpen(true);
    };

    const handleSuccess = () => {
        setIsPreviewModalOpen(false);
        setOfferLetterData(null);
        setFormKey(prev => prev + 1);
    };

    return (
        <div className="w-full mx-auto p-6 md:p-8 space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Letters</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and manage various employee letters.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-primary rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor="letter-type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Letter Type
                        </label>
                        <select
                            id="letter-type"
                            value={selectedLetter}
                            onChange={(e) => {
                                setSelectedLetter(e.target.value);
                                setSelectedForm('');
                            }}
                            className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green w-full cursor-pointer text-gray-700 dark:text-gray-200"
                        >
                            <option value="" disabled>Select a letter...</option>
                            {letterTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor="form-type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Form Type
                        </label>
                        <select
                            id="form-type"
                            value={selectedForm}
                            onChange={(e) => {
                                setSelectedForm(e.target.value);
                                setSelectedLetter('');
                            }}
                            className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green w-full cursor-pointer text-gray-700 dark:text-gray-200"
                        >
                            <option value="" disabled>Select a form...</option>
                            {formTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content for the selected letter/form */}
                {(selectedLetter || selectedForm) && (
                    <div key={formKey} className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        {selectedLetter === 'Offer Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Offer Letter Details</h2>
                                <OfferLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Internship Offer Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Internship Offer Details</h2>
                                <InternshipOfferLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Appointment Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appointment Letter Details</h2>
                                <AppointmentLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Confirmation Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Confirmation Letter Details</h2>
                                <ConfirmationLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Increment Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Increment Letter Details</h2>
                                <IncrementLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Experience Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Experience Letter Details</h2>
                                <ExperienceLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Relieving Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Relieving Letter Details</h2>
                                <RelievingLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedLetter === 'Warning Letter' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Warning Letter Details</h2>
                                <WarningLetterForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}

                        {selectedForm === 'Asset Issue Form' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Asset Issue Details</h2>
                                <AssetsIssueForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedForm === 'Handover Form' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Handover Details</h2>
                                <EmployeeHandoverForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                        {selectedForm === 'No Dues Form' && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">No Dues Details</h2>
                                <NoDuesForm onSubmit={handleOfferLetterSubmit} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <DynamicLetterPreviewModal 
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                onSuccess={handleSuccess}
                data={offerLetterData}
                selectedLetter={selectedLetter || selectedForm}
            />
        </div>
    );
}
