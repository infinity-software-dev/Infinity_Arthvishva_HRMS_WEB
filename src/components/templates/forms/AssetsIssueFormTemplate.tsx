import React from 'react';
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';

export interface AssetRow {
    assetType: string;    // e.g. "Laptop / Desktop / Mobile"
    brandModel?: string;
    serialNumber?: string;
    assetId?: string;
    condition?: string;   // e.g. "New / Good"
}

export interface AssetsIssueFormData {
    employeeTitle?: string;
    employeeName?: string;
    employeeId?: string;
    department?: string;
    designation?: string;
    dateOfIssue?: string;
    /** Defaults to one sample row + one blank row, like the Word file */
    assets?: AssetRow[];
}


const TABLE_CSS = `
.af-table { width: 100%; border-collapse: collapse; margin: 8pt 0 16pt 0; }
.af-table th, .af-table td { border: 1px solid #000; padding: 5px 8px; text-align: left; vertical-align: top; }
.af-table th { font-weight: 700; }
.af-avoid { break-inside: avoid; }
`;

const defaultAssets: AssetRow[] = [
    { assetType: 'Laptop / Desktop / Mobile', brandModel: '[Brand/Model]', serialNumber: '[Serial No.]', assetId: '[Asset ID]', condition: 'New / Good' },
    { assetType: '' },
];

export const AssetsIssueFormTemplate: React.FC<{ data?: AssetsIssueFormData }> = ({ data = {} }) => {
    const rows = data.assets && data.assets.length ? data.assets : defaultAssets;

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
                ASSET ISSUE FORM
            </p>

            <p style={{ margin: '0 0 12pt 0' }}>
                This is to confirm that the following company asset(s) have been issued to you for official use. Please find the details below:
            </p>

            <p style={{ textAlign: 'center', fontWeight: 700, margin: '0 0 4pt 0' }}>Employee Details</p>
            <table className="af-table">
                <thead>
                    <tr><th style={{ width: '10%' }}>Sr No</th><th style={{ width: '30%' }}>Particulars</th><th>Details</th></tr>
                </thead>
                <tbody>
                    {[
                        ['Employee Name', (data.employeeTitle ? `${data.employeeTitle} ` : '') + (data.employeeName || '')],
                        ['Employee ID', data.employeeId],
                        ['Department', data.department],
                        ['Designation', data.designation],
                        ['Date of Issue', data.dateOfIssue],
                    ].map(([label, val], i) => (
                        <tr key={label}>
                            <td>{i + 1}</td>
                            <td>{label}</td>
                            <td>{val || '\u00A0'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p style={{ textAlign: 'center', fontWeight: 700, margin: '0 0 4pt 0' }}>Asset Details</p>
            <table className="af-table">
                <thead>
                    <tr>
                        <th style={{ width: '8%' }}>Sr No.</th>
                        <th>Asset Type</th>
                        <th>Brand / Model</th>
                        <th>Serial Number</th>
                        <th>Asset ID</th>
                        <th>Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{r.assetType || '\u00A0'}</td>
                            <td>{r.brandModel || '\u00A0'}</td>
                            <td>{r.serialNumber || '\u00A0'}</td>
                            <td>{r.assetId || '\u00A0'}</td>
                            <td>{r.condition || '\u00A0'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p style={{ margin: '0 0 12pt 0' }}>
                This is to confirm that the following company asset(s) have been issued to you for official use. Please find the details below:
            </p>

            <div className="af-avoid" style={{ display: 'flex', flexDirection: 'column', gap: '28pt', marginBottom: '28pt' }}>
                <div>
                    <p style={{ fontWeight: 700, margin: '0 0 20pt 0' }}>Issued By (HR / IT)</p>
                    <p style={{ margin: 0, borderTop: '1px solid #000', width: '160px' }}>&nbsp;</p>
                </div>
                <div>
                    <p style={{ fontWeight: 700, margin: '0 0 20pt 0' }}>Signature</p>
                    <p style={{ margin: 0, borderTop: '1px solid #000', width: '160px' }}>&nbsp;</p>
                </div>
            </div>
        </LetterHeadLayout>
    );
};