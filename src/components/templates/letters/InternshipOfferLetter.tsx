import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';
import { EmployeeAcceptance } from '../EmployeeAcceptance';

export interface InternshipOfferLetterData {
    date: string;                 // e.g. 00/00/2026
    internTitle?: string;
    internName: string;
    designation: string;
    department: string;           // e.g. Finance, Marketing, Sales, Accounts
    startDate: string;
    endDate: string;
    focusAreas: string;           // keywords for the department, e.g. "accounting, finance, and financial operations"
    projectTitle: string;
    projectScope: string[];       // shown as a numbered list
    responsibilities: string[];   // shown as a bulleted list
    reportingTo: string;          // e.g. "Finance Manager / Mentor Name & Designation"
    stipend: string;              // amount only, e.g. "5,000"
    workingHours: string;         // e.g. "Monday to Friday, 09:30 AM to 06:30 PM"
}



type Align = 'left' | 'justify' | 'center' | 'right';

/** One Word paragraph: 8pt space after. Empty = blank line. */
const P: React.FC<{ align?: Align; heading?: boolean; children?: React.ReactNode }> = ({
    align = 'justify',
    heading,
    children,
}) => (
    <p className={heading ? 'io-h' : undefined} style={{ margin: '0 0 8pt 0', textAlign: align }}>
        {children ?? '\u00A0'}
    </p>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong>{children}</strong>;

/** Bullet style section heading */
const NumHeading: React.FC<{ n?: number; children: React.ReactNode }> = ({ children }) => (
    <p className="io-h" style={{ position: 'relative', margin: '0 0 4pt 0', paddingLeft: '24px', fontWeight: 700, textAlign: 'justify' }}>
        <span style={{ position: 'absolute', left: 0, fontWeight: 700 }}>•</span>
        {children}
    </p>
);

/** List with no gap between items and 8pt after the last one (Word "contextual spacing") */
const List: React.FC<{ items: string[]; marker: (i: number) => string }> = ({ items, marker }) => (
    <div style={{ marginBottom: '8pt' }}>
        {items.map((t, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '24px', textAlign: 'justify' }}>
                <span style={{ position: 'absolute', left: 0 }}>{marker(i)}</span>
                {t}
            </div>
        ))}
    </div>
);

export const InternshipOfferLetterTemplate: React.FC<{ data: InternshipOfferLetterData }> = ({ data }) => {
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
                INTERNSHIP OFFER LETTER
            </p>
            <P align="left"><B>Date:</B> {data.date}</P>

            <P align="left">To,</P>
            <P align="left"><B>{(data.internTitle ? `${data.internTitle} ` : '') + data.internName}</B></P>
            <P align="center" />

            <P align="center"><B>Subject:</B> Internship Offer- <B>{data.department}</B></P>

            <P>Dear <B>{(data.internTitle ? `${data.internTitle} ` : '') + data.internName},</B></P>

            <P>
                We are pleased to offer you an Internship in the <B>{data.department}</B> Department with <B>Infinity Arthvishva</B>, effective from{' '}
                <B>{data.startDate} to {data.endDate}</B>. This internship is intended to provide practical exposure to <B>{data.focusAreas}.</B>
            </P>

            <NumHeading n={1}>Assigned Project</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P><B>Project Title:</B> {data.projectTitle}</P>
                <P><B>Project Scope:</B></P>
                <List items={data.projectScope} marker={(i) => `${i + 1}.`} />
            </div>

            <NumHeading n={2}>Roles &amp; Responsibilities</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P>As a {data.designation}, your responsibilities will include:</P>
                <List items={data.responsibilities} marker={() => '•'} />
            </div>

            <NumHeading n={3}>Reporting &amp; Supervision</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P>You will report to <B>{data.reportingTo}</B>.</P>
            </div>

            <NumHeading n={4}>Stipend</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P>You will receive a stipend of <B>₹ {data.stipend}</B> per month as per company policy.</P>
            </div>

            <NumHeading n={5}>Working Hours</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P>Working hours will be <B>{data.workingHours}</B> as per company norms.</P>
            </div>

            <NumHeading n={6}>Confidentiality</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P>You shall maintain strict confidentiality of all financial and business information during and after the internship.</P>
            </div>

            <NumHeading n={7}>Completion Certificate</NumHeading>
            <div style={{ paddingLeft: '24px', marginBottom: '8pt' }}>
                <P>On successful completion of the internship, you will be issued an Internship Completion Certificate.</P>
            </div>

            <P>We look forward to having you as part of our organization and wish you a valuable learning experience.</P>

            <div className="io-avoid mt-8">
                <div className="space-y-1 text-left">
                    <p>Regards,</p>
                    <p>Infinity Arthvishva</p>

                </div>

                <EmployeeAcceptance name={`${data.internTitle ? `${data.internTitle} ` : ''}${data.internName}`.trim()} />
            </div>
        </LetterHeadLayout>
    );
};