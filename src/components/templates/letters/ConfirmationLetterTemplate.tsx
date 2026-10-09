import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';
import { EmployeeAcceptance } from '../EmployeeAcceptance';

export interface ConfirmationLetterData {
    date: string;                   // e.g. 00/00/2026
    letterNumber: string;           // -> "Ref. No, HR/Confirmation Letter/ <letterNumber>/2025-2026"
    financialYear?: string;         // default "2025-2026"
    employeeTitle?: string;
    employeeName: string;
    designation: string;
    department: string;
    confirmationDate: string;       // date from which the employment is confirmed
    signatoryName?: string;         // name of the owner / HR / authorised person (optional)
    signatoryDesignation?: string;  // default "Director/ HR Manager"
}



type Align = 'left' | 'justify' | 'center' | 'right';

/** One Word paragraph: no spacing before/after, single line. Empty = blank line. */
const P: React.FC<{ align?: Align; children?: React.ReactNode }> = ({ align = 'left', children }) => (
    <p style={{ margin: 0, textAlign: align }}>{children ?? '\u00A0'}</p>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong>{children}</strong>;

export const ConfirmationLetterTemplate: React.FC<{ data: ConfirmationLetterData }> = ({ data }) => {
    const fy = data.financialYear || '2025-2026';

    return (
        <LetterHeadLayout>
            <p
                style={{
                    margin: '0 0 16pt 0',
                    textAlign: 'center',
                    fontSize: '16pt',
                    fontWeight: 700,
                    color: '#2F5496',
                    textDecoration: 'underline',
                    textTransform: 'uppercase',
                }}
            >
                CONFIRMATION LETTER
            </p>
            <P align="left"><B>Date:</B> {data.date}</P>
            <P align="center" />

            <P>Ref. No, HR/Confirmation Letter/ {data.letterNumber}/{fy}</P>
            <P />

            <P>To,</P>
            <P>{data.employeeTitle ? `${data.employeeTitle} ` : ''}{data.employeeName}</P>
            <P>{data.designation}</P>
            <P>{data.department}</P>
            <P />

            <P align="center"><B>Subject:</B> Confirmation of employment</P>
            <P align="justify" />

            <P align="justify">Dear {data.employeeTitle ? `${data.employeeTitle} ` : ''}{data.employeeName},</P>
            <P align="justify" />

            <P align="justify">
                We are pleased to inform you that, based on your performance and conduct during the probation period, your service has been found satisfactory. Accordingly, your employment with Infinity Arthvishva is hereby confirmed with effect from {data.confirmationDate}.
            </P>
            <P align="justify" />

            <P align="justify">
                Your designation, roles, responsibilities and reporting structure will remain the same as per your appointment letter. All terms and conditions of employment mentioned in your appointment letter and company policies will continue to apply.
            </P>
            <P align="justify" />

            <P align="justify">
                We appreciate your contribution to the organisation and look forward to your continued support and commitment towards achieving our company goals.
            </P>
            <P align="justify" />

            <P align="justify">Please acknowledge receipt of this letter by signing and returning a copy to the HR department.</P>
            <P align="justify">Wishing you a successful career with Infinity Arthvishva.</P>
            <P align="justify" />
            <P align="justify" />

            <div className="cl-avoid">
                <P align="justify">Infinity Arthvishva</P>
                <P align="justify">{data.signatoryName || '\u00A0'}</P>
                <P align="justify" />
                <P align="justify">{data.signatoryDesignation || 'Director/ HR Manager'}</P>
            </div>

            <div style={{ marginTop: '40px' }}>
                <EmployeeAcceptance name={`${data.employeeTitle ? `${data.employeeTitle} ` : ''}${data.employeeName}`.trim()} />
            </div>
        </LetterHeadLayout>
    );
};