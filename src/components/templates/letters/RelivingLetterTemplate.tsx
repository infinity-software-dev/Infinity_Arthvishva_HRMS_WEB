import React from "react";
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';

export interface RelievingLetterData {
    date: string;               // e.g. 01/01/2026
    employeeTitle: string;      // Mr / Ms / Mrs
    employeeName: string;
    employeeId?: string;
    designation: string;
    lastWorkingDate: string;
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
        ? { He: 'He', he: 'he', his: 'his', him: 'him' }
        : { He: 'She', he: 'she', his: 'her', him: 'her' };
};

export const RelivingLetterTemplate: React.FC<{ data: RelievingLetterData }> = ({ data }) => {
    const p = pronouns(data.employeeTitle, data.gender);
    const fullName = `${data.employeeTitle} ${data.employeeName}`;
    const displayDate = formatDisplayDate(data.date);
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
                RELIEVING LETTER
            </p>
            <P />
            <P align="left">Date: {displayDate}</P>
            <P align="justify" body />

            <P align="justify" body>To whomsoever it may concern,</P>

            <P align="justify" body>
                This is to inform you that <B>{fullName}</B>{data.employeeId ? <> (Employee ID: <B>{data.employeeId}</B>)</> : ''}, <B>{data.designation},</B> has been relieved from the services of{' '}
                <B>Infinity Arthvishva</B> with effect from <B>{displayLastWorkingDate},</B> pursuant to <B>{p.his}</B> resignation.
            </P>

            <P align="justify" body>
                <B>{p.He}</B> completed all the assigned responsibilities and fulfilled the required exit formalities. There are no dues pending against <B>{p.him}</B> as on the last working day.
            </P>

            <P align="justify" body>
                We thank <B>{fullName}</B> for <B>{p.his}</B> contributions to the organization during the tenure and wish <B>{p.him}</B> success in future endeavors.
            </P>
            <P align="justify" body />

            <div className="rl-avoid">
                <P align="justify" body>Regards,</P>
                <P align="justify" body>Infinity Arthvishva</P>
                <P align="justify" body />
                <P align="justify" body />
                <P align="justify" body>Signature/ Stamp</P>
            </div>
        </LetterHeadLayout>
    );
};