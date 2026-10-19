import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';
import { EmployeeAcceptance } from '../EmployeeAcceptance';
import { SalaryAnnexureTable } from '@/components/templates/letters/SalaryAnnexureTable';
import type { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';
import { ExtraPoint } from '@/types/letterTypes';

export interface IncrementLetterData {
    // letterNumber?: string;
    financialYear?: string;
    date: string;
    candidateTitle?: string;
    candidateName: string;
    effectiveDate: string;
    joiningDate: string;
    employeeId: string;
    existingSalary?: string;
    revisedAnnualCTC: string;
    designation: string;
    revisedTerms?: string;
    extraPoints?: ExtraPoint[];
}

interface IncrementLetterTemplateProps {
    data: IncrementLetterData;
    annexure?: SalaryAnnexureData | null;
}

const formatDisplayDate = (d?: string) => {
    if (!d) return "";
    if (d.includes("-")) {
        const parts = d.split("-");
        if (parts.length === 3 && parts[0].length === 4) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    return d;
};

type Align = 'left' | 'justify' | 'center' | 'right';

/** One Word paragraph: 8pt space after; body paragraphs have a 323 twip (~21.5px) right indent. Empty = blank line. */
const P: React.FC<{ align?: Align; indent?: boolean; children?: React.ReactNode }> = ({
    align = 'justify',
    indent = true,
    children,
}) => (
    <p style={{ margin: '0 0 8pt 0', paddingRight: indent ? '21.5px' : 0, textAlign: align }}>
        {children ?? '\u00A0'}
    </p>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong>{children}</strong>;

const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div style={{ display: 'flex', margin: '0 0 8pt 0', paddingRight: '21.5px' }}>
        <span style={{ width: '2in', flexShrink: 0 }}>{label}</span>
        <span>- {value}</span>
    </div>
);

export const IncrementLetterTemplate: React.FC<IncrementLetterTemplateProps> = ({ data, annexure }) => {
    const fy = data.financialYear || '2025-2026';
    const effectiveDateStr = formatDisplayDate(data.effectiveDate);
    const displayDate = formatDisplayDate(data.date);
    const displayJoiningDate = formatDisplayDate(data.joiningDate);

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
                INCREMENT LETTER
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '0 0 8pt 0' }}>
                {/* <span>Infinity/Increment Letter/ {fy}/{data.letterNumber}</span> */}
                <span>Date: {displayDate}</span>
            </div>

            <P align="justify" indent={false}>Dear <B>{data.candidateTitle ? `${data.candidateTitle} ` : ''}{data.candidateName}</B></P>

            <P>
                Your salary has been hiked effective from {effectiveDateStr}. We thank you for being associated with the company and as a token of gratitude, we have decided to do the increment. We expect your efforts for the financial year {fy} in achieving the targets and putting efforts in executing your responsibilities.
            </P>

            <Row label="Joining Date" value={displayJoiningDate} />
            <Row label="Employee ID" value={data.employeeId} />
            {data.existingSalary && <Row label="Your Existing Salary is" value={data.existingSalary} />}
            <Row label="Your Revised Annual CTC is" value={data.revisedAnnualCTC} />
            <Row label="Your designation is" value={data.designation} />
            <Row label="Revised Terms & conditions" value={data.revisedTerms} />

            <div className="mb-3 break-inside-avoid ap-avoid in-avoid">
                <div style={{ display: 'flex', alignItems: 'flex-start', margin: '0 0 8pt 0', paddingRight: '21.5px', textAlign: 'justify' }}>
                    <span style={{ marginRight: '8px', fontWeight: 700, userSelect: 'none' }}>•</span>
                    <div>
                        <B>Performance Appraisals:</B> Shall be based on the company, project and individual performance. Depending upon project target achievement and Department target achievement  increment shall be considered. Based on Performance achievement, the Increments shall be done. Yearly target and achievement shall be appraised for the projects and the departments and on the basis of it Increment policy shall be implemented.
                    </div>
                </div>
            </div>

            <div className="mb-3 break-inside-avoid ap-avoid in-avoid">
                <div style={{ display: 'flex', alignItems: 'flex-start', margin: '0 0 8pt 0', paddingRight: '21.5px', textAlign: 'justify' }}>
                    <span style={{ marginRight: '8px', fontWeight: 700, userSelect: 'none' }}>•</span>
                    <div>
                        <B>Non-Compliance:</B> If during the service period if you are found guilty of any unethical practices or have done any losses of property, machinery, documents, or defame company name, manipulation of work-related activity or done financial losses or if you are engaged in other services of employment, as well as if you do not serve working notice period of <B>30 days</B> and proper handover not done, etc... or conduct any business during the service period. Then you will be liable to incur the losses, pay to company <B>30 days</B> salary, no experience letter shall be provided and management reserves the right to take legal action against you for noncompliance of the same.
                    </div>
                </div>
            </div>

            {/* Extra Points — above Notice Period */}
            {data.extraPoints && data.extraPoints.length > 0 && data.extraPoints.map((ep, idx) =>
                ep.title.trim() ? (
                    <div key={idx} className="mb-3 break-inside-avoid ap-avoid in-avoid">
                        <div style={{ display: 'flex', alignItems: 'flex-start', margin: '0 0 8pt 0', paddingRight: '21.5px', textAlign: 'justify' }}>
                            <span style={{ marginRight: '8px', fontWeight: 700, userSelect: 'none', flexShrink: 0 }}>•</span>
                            <div style={{ overflowWrap: 'anywhere', minWidth: 0, flex: 1 }}>
                                <B>{ep.title}</B>{ep.description.trim() ? ` ${ep.description}` : ''}
                            </div>
                        </div>
                    </div>
                ) : null
            )}

            <div className="mb-3 break-inside-avoid ap-avoid in-avoid">
                <div style={{ display: 'flex', alignItems: 'flex-start', margin: '0 0 8pt 0', paddingRight: '21.5px', textAlign: 'justify' }}>
                    <span style={{ marginRight: '8px', fontWeight: 700, userSelect: 'none' }}>•</span>
                    <div>
                        <B>Notice Period:</B> In case you wish to resign/ leave the services of the company, you would have to give a <B>30 days'</B> working notice period to the company and proper handover procedure. If you fail to provide such a notice period then you will not get the salary and as well as Experience and Relieving letter will not be provided without the above-mentioned notice period. And no claims or reimbursements if any shall be paid.
                    </div>
                </div>
            </div>

            <P>Salary Annexure sheet attached for your reference.</P>

            {annexure && (
                <div className="mt-6 break-inside-avoid ap-avoid in-avoid">
                    <SalaryAnnexureTable data={annexure} />
                </div>
            )}

            <div style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
                <P>We look forward for a long-term association with your progressive career growth in the organization.</P>

                <div className="in-avoid" style={{ marginTop: '16px' }}>
                    <P>Regards,</P>
                    <P>Infinity Arthvishva</P>
                </div>
            </div>

            <div style={{ pageBreakBefore: 'always', breakBefore: 'page', marginTop: '20px' }}>
                <EmployeeAcceptance name={`${data.candidateTitle ? `${data.candidateTitle} ` : ''}${data.candidateName}`.trim()} />
            </div>
        </LetterHeadLayout>
    );
};