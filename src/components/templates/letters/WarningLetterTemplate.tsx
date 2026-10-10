import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';

export interface WarningLetterData {
    date: string;                 // e.g. 00/00/2026
    employeeTitle?: string;
    employeeName: string;
    designation: string;
    department: string;
    subject?: string;             // default: "Warning for unprofessional conduct"
    misconduct: string;           // what the employee did (shown in bold)
    issuerName?: string;
    issuerDesignation?: string;
}



/** One Word paragraph: no spacing before/after, single line. Empty = blank line. */
const P: React.FC<{ align?: 'left' | 'justify' | 'center' | 'right'; children?: React.ReactNode }> = ({
    align = 'left',
    children,
}) => <p style={{ margin: 0, textAlign: align }}>{children ?? '\u00A0'}</p>;

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong>{children}</strong>;

export const WarningLetterTemplate: React.FC<{ data: WarningLetterData }> = ({ data }) => {
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
                WARNING LETTER
            </p>
            <P align="left">Date: {data.date}</P>
            <P />

            <P align="justify">To,</P>
            <P align="justify">{data.employeeTitle ? `${data.employeeTitle} ` : ''}{data.employeeName}</P>
            <P align="justify">{data.designation}</P>
            <P align="justify">{data.department}</P>
            <P />

            <P align="center"><B>Subject:</B> {data.subject || 'Warning for unprofessional conduct'}</P>
            <P align="center" />

            <P align="justify"><B>Dear {data.employeeTitle ? `${data.employeeTitle} ` : ''}{data.employeeName},</B></P>
            <P align="justify" />

            <P align="justify">
                This letter is issued as a formal warning regarding your recent unprofessional conduct and failure to adhere to expected work standards.
            </P>
            <P align="justify" />

            <P align="justify">
                It has been observed that you have been <B>{data.misconduct}</B>{' '}
            </P>
            <P align="justify" />

            <P align="justify">
                Such behaviour is considered a serious lapse in professional responsibility, and it is not acceptable. Your actions have caused inconvenience to the team and disruption to business operations, which violate company policies and employment terms.
            </P>
            <P align="justify" />

            <P align="justify">
                You are hereby warned to improve your conduct immediately, ensure timely communication and cooperation with the team and management.
            </P>
            <P align="justify" />

            <P align="justify">
                Please note that repetition of such behaviour in the future may lead to stricter disciplinary action, including the issuance of a notice period as per company policy.
            </P>
            <P align="justify" />

            <P align="justify">
                You are advised to treat this warning with seriousness and take corrective action without delay.
            </P>
            <P align="justify" />
            <P align="justify" />

            <div className="wl-avoid">
                <P align="justify">Regards,</P>
                <P>Infinity Arthvishva</P>
            </div>
        </LetterHeadLayout>
    );
};