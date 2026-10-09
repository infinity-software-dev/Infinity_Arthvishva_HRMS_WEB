import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';
import { EmployeeAcceptance } from '../EmployeeAcceptance';
import { SalaryAnnexureTable } from '@/components/templates/letters/SalaryAnnexureTable';
import type { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';

import { ExtraPoint } from '@/types/letterTypes';

export interface OfferLetterData {
    refNo: string;
    date: string;
    candidateTitle: string;
    candidateName: string;
    designation: string;
    department: string;
    joiningDate: string;
    reportingTo: string;
    monthlyCTC: string;
    monthlyCTCWords: string;
    annualCTC: string;
    annualCTCWords: string;
    acceptanceDate: string;
    responsibilities?: string;
    extraPoints?: ExtraPoint[];
}

interface OfferLetterTemplateProps {
    data: OfferLetterData;
    annexure?: SalaryAnnexureData | null;
}



const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4 break-inside-avoid">
        <h3 className="font-bold mb-1 flex items-start">
            <span className="mr-2 font-bold select-none">•</span>
            <span>{title}</span>
        </h3>
        <div className="pl-4 text-justify">
            {children}
        </div>
    </div>
);

export const OfferLetterTemplate: React.FC<OfferLetterTemplateProps> = ({ data, annexure }) => {
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
                OFFER LETTER
            </p>

            <div className="mb-8 text-left">
                <div>Ref No. {data.refNo}</div>
                <div>Date: {data.date}</div>
            </div>

            <div className="mb-8 text-left">
                <p>To,</p>
                <p>{data.candidateTitle} {data.candidateName}</p>
            </div>

            <div className="text-center font-bold mb-8">
                Sub: Offer Letter for the post of {data.designation}
            </div>

            <div className="mb-4 text-left">
                <p className="font-bold">Dear {data.candidateTitle} {data.candidateName},</p>
            </div>

            <p className="mb-4 text-justify">
                We are pleased to offer you the position of <span className="font-bold">{data.designation}</span> at <span className="font-bold">Infinity Arthvishva</span>.
                Based on our assessment of your technical skills, learning attitude, and potential, we believe you will contribute positively to our development team and ongoing projects. Terms and condition of employment are given below.
            </p>

            <Section title="Employment Details:">
                <p>You are appointed as <span className="font-bold">{data.designation}</span> in the <span className="font-bold">{data.department}</span> on a fulltime basis. Your employment will start from <span className="font-bold">{data.joiningDate}</span>. You will be reporting to <span className="font-bold">{data.reportingTo}</span>.</p>
            </Section>

            <Section title="Monthly Compensation:">
                <p>Your monthly CTC is (Rs. {data.monthlyCTC}/-) (Rupees {data.monthlyCTCWords} Only). Your Annual CTC will be (Rs. {data.annualCTC}/-) (Rupees {data.annualCTCWords} Only). A detailed annexure attached to this letter.</p>
            </Section>

            <Section title="Working Hours:">
                <p>Your working hours will be from 09:30 AM to 06:30 PM (8.30 Hrs) From Monday to Friday and 10:00 AM to 5:00 PM for Saturday as per company policy.</p>
            </Section>

            <Section title="Leave & Holiday:">
                <p>You will be eligible for earned leave and declared holidays as per the company leave policy and applicable statutory requirements. The company leave policy, as updated from time to time, will apply to you throughout your employment with the company. Leave availed without prior approval or beyond the eligible limit may be treated as leave without pay.</p>
            </Section>

            <Section title="Probation:">
                <p>You will be on probation for a period of 6 months from your date of joining. During this period, your performance will be reviewed. Upon successful completion of your probation, your employment will be confirmed.</p>
            </Section>

            <Section title="Confidentiality:">
                <p>During the course of your employment, you may have access to confidential information relating to the company, its client, operations and business affairs. You shall maintain strict confidentiality of such information and shall not disclose it to any third party during or after your employment, except as required in the course of your duties or by law.</p>
            </Section>

            {data.responsibilities && (
                <Section title="Key Responsibilities:">
                    <ul className="list-disc pl-4 space-y-1">
                        {data.responsibilities.split('\n').filter(r => r.trim() !== '').map((res, index) => (
                            <li key={index} className="text-justify">{res.replace(/^•\s*/, '')}</li>
                        ))}
                    </ul>
                </Section>
            )}

            {data.extraPoints && data.extraPoints.length > 0 && data.extraPoints.map((ep, idx) =>
                ep.title.trim() ? (
                    <Section key={idx} title={ep.title}>
                        {ep.description.trim() && (
                            <p style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                {ep.description}
                            </p>
                        )}
                    </Section>
                ) : null
            )}

            <Section title="Termination:">
                <ol className="list-[lower-alpha] pl-4 space-y-1">
                    <li>During the probation period, company may terminate employment by giving 15-30 days' notice period.</li>
                    <li>The company may terminate employment without notice in case of gross misconduct, breach of company policies or violation of applicable law.</li>
                </ol>
            </Section>

            {annexure && (
                <div className="mt-6 break-inside-avoid">
                    <SalaryAnnexureTable data={annexure} />
                </div>
            )}

            <div className="ap-avoid mb-4">
                <Section title="Notice Period:">
                    <p className="mb-3">In case if you wish to resign from the company, you are required to provide 30 Days' notice period. During the notice period, you shall diligently perform your duties and ensure a proper handover of responsibilities, ongoing work, and all company property and assets provided to you.</p>
                    <p>Your salary for the notice period shall be released in the normal payroll cycle, subject to completion of the handover process and return of all company assets, and in accordance with applicable statutory provisions. In the event of separation without serving the required notice period or without completing the handover and assets clearance, the company reserves the rights to adjust or recover dues in accordance with law.</p>
                </Section>
            </div>

            <Section title="Acceptance of Offer:">
                <p>You are requested to confirm your acceptance of this offer by signing and returning a copy of this letter on or before <span className="font-bold">{data.acceptanceDate}</span>. Your signature shall indicate your agreement to abide by the terms and conditions of employment, including company policies applicable from time to time.</p>
            </Section>

            <div className="ap-avoid mt-8">
                <div className="space-y-1 text-left">
                    <p>Regards,</p>
                    <p>HR</p>
                    <p>Infinity Arthvishva</p>
                </div>


                <EmployeeAcceptance name={`${data.candidateTitle} ${data.candidateName}`.trim()} />
            </div>
        </LetterHeadLayout>
    );
};