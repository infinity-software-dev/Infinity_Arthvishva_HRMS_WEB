import React from 'react';
import { OfferLetterTemplate } from '@/components/templates/letters/OfferLetterTemplate';
import { InternshipOfferLetterTemplate } from '@/components/templates/letters/InternshipOfferLetter';
import { AppointmentLetterTemplate } from '@/components/templates/letters/AppoiontmentLetterTemplate';
import { ConfirmationLetterTemplate } from '@/components/templates/letters/ConfirmationLetterTemplate';
import { IncrementLetterTemplate } from '@/components/templates/letters/IncrementLetterTemplate';
import { ExperienceLetterTemplate } from '@/components/templates/letters/ExperienceLetterTemplate';
import { RelivingLetterTemplate } from '@/components/templates/letters/RelivingLetterTemplate';
import { WarningLetterTemplate } from '@/components/templates/letters/WarningLetterTemplate';
import { AssetsIssueFormTemplate } from '@/components/templates/forms/AssetsIssueFormTemplate';
import { EmployeeHandoverFormTemplate } from '@/components/templates/forms/EmployeeHandoverFormTemplate';
import { NoDuesFormTemplate } from '@/components/templates/forms/NoDuesFormTemplate';

interface DynamicLetterRendererProps {
    selectedLetter: string;
    data: any;
}

export const DynamicLetterRenderer: React.FC<DynamicLetterRendererProps> = ({
    selectedLetter,
    data
}) => {
    switch (selectedLetter) {
        case 'Offer Letter':
            return <OfferLetterTemplate data={data} />;
        case 'Internship Offer Letter':
            return <InternshipOfferLetterTemplate data={data} />;
        case 'Appointment Letter':
            return <AppointmentLetterTemplate data={data} annexureB={data?.annexureB} />;
        case 'Confirmation Letter':
            return <ConfirmationLetterTemplate data={data} />;
        case 'Increment Letter':
            return <IncrementLetterTemplate data={data} />;
        case 'Experience Letter':
            return <ExperienceLetterTemplate data={data} />;
        case 'Relieving Letter':
            return <RelivingLetterTemplate data={data} />;
        case 'Warning Letter':
            return <WarningLetterTemplate data={data} />;
        case 'Asset Issue Form':
            return <AssetsIssueFormTemplate data={data} />;
        case 'Handover Form':
            return <EmployeeHandoverFormTemplate data={data} />;
        case 'No Dues Form':
            return <NoDuesFormTemplate data={data} />;
        default:
            return <p className="text-center p-4">Preview not available</p>;
    }
};
