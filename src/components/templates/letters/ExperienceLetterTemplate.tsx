import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';

export interface ExperienceLetterData {
    date: string;               // e.g. 01/01/2026
    employeeTitle: string;      // Mr / Ms / Mrs
    employeeName: string;
    employeeId?: string;
    joiningDate: string;
    lastWorkingDate: string;
    designation: string;
    department: string;
    /** Optional (leave empty to skip the "was responsible for ..." sentence) */
    responsibilities?: string;
    /** Optional: 'male' | 'female'. If omitted it is taken from the title (Mr = male, else female) */
    gender?: 'male' | 'female';
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

const BODY_LINE = 1.72; // 1.5 line spacing in Word (on Arial)

const P: React.FC<{ align?: 'left' | 'justify' | 'center' | 'right'; body?: boolean; children?: React.ReactNode }> = ({
    align = 'left',
    body,
    children,
}) => (
    <p style={{ margin: '0 0 8pt 0', textAlign: align, lineHeight: body ? BODY_LINE : undefined }}>
        {children ?? '\u00A0'}
    </p>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong>{children}</strong>;

const pronouns = (title: string, gender?: 'male' | 'female') => {
    const male = gender ? gender === 'male' : /^mr\.?$/i.test(title.trim());
    return male
        ? { He: 'He', his: 'his', him: 'him' }
        : { He: 'She', his: 'her', him: 'her' };
};

export const ExperienceLetterTemplate: React.FC<{ data: ExperienceLetterData }> = ({ data }) => {
    const p = pronouns(data.employeeTitle, data.gender);
    const fullName = `${data.employeeTitle} ${data.employeeName}`;
    const displayDate = formatDisplayDate(data.date);
    const displayJoiningDate = formatDisplayDate(data.joiningDate);
    const displayLastWorkingDate = formatDisplayDate(data.lastWorkingDate);

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
                EXPERIENCE LETTER
            </p>
            <P />
            <P align="left">Date: {displayDate}</P>
            <P align="justify" body />

            <P align="justify" body>To whomsoever it may concern,</P>

            <P align="justify" body>
                This is to certify that <B>{fullName}</B>{data.employeeId ? <> (Employee ID: <B>{data.employeeId}</B>)</> : ''} was employed with <B>Infinity Arthvishva</B> from{' '}
                <B>{displayJoiningDate} to {displayLastWorkingDate}</B> as a <B>{data.designation}</B> in the <B>{data.department}.</B>
            </P>

            <P align="justify" body>
                During the tenure of {p.his} employment, <B>{p.He}</B> was responsible for{' '}
                {data.responsibilities ? <B>{data.responsibilities}</B> : null}
                {data.responsibilities ? '. ' : ' the assigned duties. '}
                <B>{p.He}</B> performed the assigned duties sincerely and to the best of <B>{p.his}</B> abilities.
            </P>

            <P align="justify" body>
                Throughout <B>{p.his}</B> association with organisation <B>{fullName}</B> performed duties with sincerity, professionalism, and integrity. <B>{p.He}</B> maintained proper conduct and discipline during the tenure of {p.his} employment.
            </P>

            <P align="justify" body>
                We appreciate <B>{p.his}</B> contribution to the organization and wish <B>{p.him}</B> success in future professional endeavors.
            </P>
            <P align="justify" />

            <div className="el-avoid">
                <P align="justify">Regards,</P>
                <P align="justify">Infinity Arthvishva</P>
            </div>
        </LetterHeadLayout>
    );
};