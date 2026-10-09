import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';
import { EmployeeAcceptance } from '../EmployeeAcceptance';
import { SalaryAnnexureTable } from '@/components/templates/letters/SalaryAnnexureTable';
import type { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';
import { ExtraPoint } from '@/types/letterTypes';

export interface AppointmentLetterData {
    date: string;                 // e.g. 01/01/2026
    employeeTitle: string;        // Mr / Ms / Mrs
    employeeName: string;
    designation: string;
    joiningDate: string;
    location: string;             // working location (place name)
    reportingDesignation: string; // who the employee reports to (designation)
    monthlyGross: string;         // amount only, e.g. "25,000"
    reportingTime: string;        // Annexure A
    reportingManager: string;     // Annexure A
    extraPoints?: ExtraPoint[];
}

interface AppointmentLetterTemplateProps {
    data: AppointmentLetterData;
    annexureB?: SalaryAnnexureData | null;
}



type Align = 'left' | 'justify' | 'center' | 'right';

/** Normal Word paragraph: 8pt space after. Empty = blank line. */
const P: React.FC<{ align?: Align; children?: React.ReactNode }> = ({ align = 'justify', children }) => (
    <p style={{ margin: '0 0 8pt 0', textAlign: align }}>{children ?? '\u00A0'}</p>
);

/** "List Paragraph" line: no space before/after. Empty = blank line. */
const L: React.FC<{ indent?: number; align?: Align; heading?: boolean; children?: React.ReactNode }> = ({
    indent = 0,
    align = 'justify',
    heading,
    children,
}) => (
    <div className={heading ? 'ap-h' : undefined} style={{ paddingLeft: indent, textAlign: align }}>
        {children ?? '\u00A0'}
    </div>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong>{children}</strong>;

/** Bullet Section Heading (replaces numbered headings) */
const BulletHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="ap-h flex items-start" style={{ fontWeight: 700, textAlign: 'justify', margin: '6pt 0 2pt 0' }}>
        <span style={{ marginRight: '8px', fontWeight: 700, userSelect: 'none', flexShrink: 0 }}>•</span>
        <span>{children}</span>
    </div>
);

/** "a.  text" (letter at 0.25in, text at 0.5in) */
const Letter: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div style={{ position: 'relative', paddingLeft: '48px', textAlign: 'justify', margin: '1pt 0' }}>
        <span style={{ position: 'absolute', left: '24px' }}>{label}</span>
        {children}
    </div>
);

export const AppointmentLetterTemplate: React.FC<AppointmentLetterTemplateProps> = ({ data, annexureB }) => {
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
                APPOINTMENT LETTER
            </p>
            <P />
            <P align="left">Date: {data.date}</P>
            <P />

            <P align="left">To,</P>
            <P align="left">{data.employeeTitle} <B>{data.employeeName}</B></P>
            <P align="left" />

            <P align="center"><B>Sub- Letter of Appointment</B></P>
            <P align="left" />

            <P>Dear {data.employeeName},</P>

            <P>
                We are pleased to appoint you as <B>{data.designation}</B> with <B>Infinity Arthvishva</B> with effect from <B>{data.joiningDate}</B> on the following terms and condition.
            </P>

            <P>
                Your working location shall be the {data.location} and you will report to the <B>{data.reportingDesignation}</B> or any other authority as may be the communicated to you from time to time.
            </P>

            <P>You shall be paid gross emoluments of (Rs.{data.monthlyGross}/- ) per month, as mutually discussed and agreed by you.</P>

            <P>
                This appointment is based on the information and documents furnished by you. In the event of any discrepancy, misrepresentation found at any stage, the company reserves the right to withdraw or revise this appointment.
            </P>

            <P>
                We congratulate you on your appointment and wish you a long and successful association with Infinity Arthvishva. We look forward to your valuable contribution to the organization and assure you of our support in your professional growth.
            </P>
            <P />

            <div className="ap-avoid">
                <P>Regards,</P>
                <P>Infinity Arthvishva</P>
                <P />
                <P>Signature</P>
            </div>

            {/* ---------------- Annexure A ---------------- */}
            <div className="ap-newpage">
                <P align="center"><B>Annexure- A</B></P>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Designation and Reporting</BulletHead>
                    <L indent={24}><span style={{ marginRight: '8px', fontWeight: 700 }}>•</span><B>Designation:</B> {data.designation}</L>
                    <L indent={24}><span style={{ marginRight: '8px', fontWeight: 700 }}>•</span><B>Location:</B> {data.location}</L>
                    <L indent={24}><span style={{ marginRight: '8px', fontWeight: 700 }}>•</span><B>Date of Joining:</B> {data.joiningDate}</L>
                    <L indent={24}><span style={{ marginRight: '8px', fontWeight: 700 }}>•</span><B>Reporting Time:</B> {data.reportingTime}</L>
                    <L indent={24}><span style={{ marginRight: '8px', fontWeight: 700 }}>•</span><B>Reporting Manager:</B> {data.reportingManager}</L>
                    <L indent={24}><span style={{ marginRight: '8px', fontWeight: 700 }}>•</span><B>Monthly Gross Salary:</B> Rs.{data.monthlyGross}/-</L>
                </div>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Appointment and Probation</BulletHead>
                    <Letter label="a.">You will be on a probation for a period of six months from your date of joining. Your performance will be reviewed during this period. Upon satisfactory completion of probation, your service will be confirmed.</Letter>
                    <Letter label="b.">The company reserves the rights to extend the probation period or discontinue employment during probation, based on performance.</Letter>
                </div>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Confidentiality</BulletHead>
                    <Letter label="a.">You shall maintain strict confidentiality of all confidential information, trade secrets, proprietary data, and business information of the company.</Letter>
                    <Letter label="b.">You shall not use such information of the company for personal benefit or disclose it to any third party during or after the tenure of the service.</Letter>
                </div>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Leave &amp; Holiday:</BulletHead>
                    <p style={{ margin: '4pt 0', paddingLeft: '24px', textAlign: 'justify' }}>
                        You will be eligible for earned leave and declared holidays as per the company leave policy and applicable statutory requirements. The company leave policy, as updated from time to time, will apply to you throughout your employment with the company. Leave availed without prior approval or beyond the eligible limit may be treated as leave without pay.
                    </p>
                </div>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Background Verification</BulletHead>
                    <p style={{ margin: '4pt 0', paddingLeft: '24px', textAlign: 'justify' }}>
                        This offer is contingent upon the successful completion of a comprehensive background check, including verification of your educational qualifications, previous employment history, and references. Any discrepancy found may lead to the immediate revocation of this offer or termination of employment.
                    </p>
                </div>

                {/* Extra Points — above Termination */}
                {data.extraPoints && data.extraPoints.length > 0 && data.extraPoints.map((ep, idx) =>
                    ep.title.trim() ? (
                        <div key={idx} className="ap-avoid mb-2 break-inside-avoid">
                            <BulletHead>{ep.title}</BulletHead>
                            {ep.description.trim() && (
                                <p style={{ margin: '4pt 0', paddingLeft: '24px', textAlign: 'justify', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                    {ep.description}
                                </p>
                            )}
                        </div>
                    ) : null
                )}

                {annexureB && (
                    <div className="mt-6 mb-4 break-inside-avoid ap-avoid">
                        <SalaryAnnexureTable data={annexureB} />
                    </div>
                )}

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Termination</BulletHead>
                    <p style={{ margin: '4pt 0', paddingLeft: '24px', textAlign: 'justify' }}>
                        In case of misconduct, indiscipline, or breach of the company policies, the company reserves the right to take appropriate disciplinary action, including termination as per applicable law or with immediate effect.
                    </p>
                </div>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Notice Period</BulletHead>
                    <Letter label="a.">In case if you wish to resign from the company, you are required to provide 30 Days' notice period. During the notice period, you shall diligently perform your duties and ensure a proper handover of responsibilities, ongoing work, and all company property and assets provided to you.</Letter>
                    <Letter label="b.">Your salary for the notice period shall be released in the normal payroll cycle, subject to completion of the handover process and return of all company assets, and in accordance with applicable statutory provisions.</Letter>
                    <Letter label="c.">In the event of separation without serving the required notice period or without completing the handover and assets clearance, the company reserves the rights to adjust or recover dues in accordance with law.</Letter>
                </div>

                <div className="ap-avoid mb-2 break-inside-avoid">
                    <BulletHead>Roles and Responsibility</BulletHead>
                    <p style={{ margin: '4pt 0', paddingLeft: '24px', textAlign: 'justify' }}>
                        Your role, responsibilities and performance expectations shall be as per Annexure-B and as may be assigned from time to time.
                    </p>
                </div>

            </div>



            <div className="ap-newpage">
                <EmployeeAcceptance name={`${data.employeeTitle} ${data.employeeName}`.trim()} />
            </div>
        </LetterHeadLayout>
    );
};