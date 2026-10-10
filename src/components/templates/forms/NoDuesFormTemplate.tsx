import React from 'react';
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';

export interface NoDuesRow {
    department: string;
    name?: string;
    dues?: string;     // "Yes" / "No"
    amount?: string;
    remarks?: string;
    signature?: string;
}

export interface NoDuesFormData {
    employeeTitle?: string;
    employeeName?: string;
    employeeId?: string;
    designation?: string;
    department?: string;
    joiningDate?: string;
    lastWorkingDay?: string;
    /** Defaults to the 10 rows from the Word file (first 3 pre-labelled, 7 blank) */
    rows?: NoDuesRow[];
}


const TABLE_CSS = `
.nd-table { width: 100%; border-collapse: collapse; margin: 8pt 0 20pt 0; }
.nd-table th, .nd-table td { border: 1px solid #000; padding: 5px 8px; text-align: left; vertical-align: top; }
.nd-table th { font-weight: 700; }
.nd-avoid { break-inside: avoid; }
`;

const defaultRows: NoDuesRow[] = [
    { department: 'HR Department' },
    { department: 'Accounts / Finance' },
    { department: 'IT / Admin' },
    { department: '' },
    { department: '' },
    { department: '' },
    { department: '' },
    { department: '' },
    { department: '' },
    { department: '' },
];

const DetailField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <li style={{ marginBottom: '6pt' }}>
        <strong>{label}:</strong> {value || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </li>
);

export const NoDuesFormTemplate: React.FC<{ data?: NoDuesFormData }> = ({ data = {} }) => {
    const rows = data.rows && data.rows.length ? data.rows : defaultRows;

    return (
        <LetterHeadLayout>
            <style>{TABLE_CSS}</style>

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
                NO DUES FORM
            </p>

            <div style={{ display: 'flex', gap: '32px', margin: '0 0 16pt 0' }}>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, flex: 1 }}>
                    <DetailField label="Employee Name" value={(data.employeeTitle ? `${data.employeeTitle} ` : '') + (data.employeeName || '')} />
                    <DetailField label="Designation" value={data.designation} />
                    <DetailField label="Joining Date" value={data.joiningDate} />
                </ul>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, flex: 1 }}>
                    <DetailField label="Employee ID" value={data.employeeId} />
                    <DetailField label="Department" value={data.department} />
                    <DetailField label="Last Working Day" value={data.lastWorkingDay} />
                </ul>
            </div>

            <table className="nd-table">
                <thead>
                    <tr>
                        <th style={{ width: '6%' }}>Sr No</th>
                        <th>Department</th>
                        <th>Name</th>
                        <th style={{ width: '10%' }}>Dues (Yes/No)</th>
                        <th style={{ width: '11%' }}>Amount</th>
                        <th>Remarks</th>
                        <th style={{ width: '13%' }}>Signature</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{r.department || '\u00A0'}</td>
                            <td>{r.name || '\u00A0'}</td>
                            <td>{r.dues || '\u00A0'}</td>
                            <td>{r.amount || '\u00A0'}</td>
                            <td>{r.remarks || '\u00A0'}</td>
                            <td>{r.signature || '\u00A0'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="nd-avoid" style={{ display: 'flex', flexDirection: 'column', gap: '30pt', marginTop: '36pt' }}>
                <p style={{ fontWeight: 700, margin: 0 }}>HR/ Reporting Manager Signature</p>
                <p style={{ fontWeight: 700, margin: 0 }}>Employee Signature</p>
            </div>
        </LetterHeadLayout>
    );
};