import React from 'react';
import { LetterHeadLayout } from '@/components/templates/LetterHeadLayout';

export interface HandoverTaskRow { task?: string; status?: string; handoverTo?: string; remarks?: string; }
export interface HandoverItemRow { item?: string; handedOver?: string; receiverName?: string; remarks?: string; }
export interface HandoverFileRow { systemAccess?: string; handedOver?: string; filePath?: string; remarks?: string; }
export interface HandoverLoginRow { loginId?: string; handedOver?: string; password?: string; remarks?: string; }

export interface EmployeeHandoverFormData {
    employeeTitle?: string;
    employeeName?: string;
    employeeId?: string;
    designation?: string;
    department?: string;
    reportingManager?: string;
    lastWorkingDate?: string;

    /** Defaults to 11 blank rows, like the Word file */
    tasks?: HandoverTaskRow[];
    /** Defaults to the 4 labelled + 1 blank row from the Word file */
    documents?: HandoverItemRow[];
    /** Defaults to 5 blank rows */
    fileHandover?: HandoverFileRow[];
    /** Defaults to 4 blank rows */
    loginHandover?: HandoverLoginRow[];

    handedOverByName?: string;
    handedOverToName?: string;
}

const TABLE_CSS = `
.hf-table { width: 100%; border-collapse: collapse; margin: 6pt 0 18pt 0; }
.hf-table th, .hf-table td { border: 1px solid #000; padding: 5px 8px; text-align: left; vertical-align: top; }
.hf-table th { font-weight: 700; }
.hf-section { font-weight: 700; margin: 0 0 4pt 0; }
.hf-avoid { break-inside: avoid; }
`;

const blank = <T,>(n: number, factory: () => T): T[] => Array.from({ length: n }, factory);

const defaultTasks: HandoverTaskRow[] = blank(11, () => ({}));
const defaultDocuments: HandoverItemRow[] = [
    { item: 'Files / Documents' },
    { item: 'Laptop / System' },
    { item: 'Email / Software Access' },
    { item: 'Other (Specify)' },
    {},
];
const defaultFileHandover: HandoverFileRow[] = blank(5, () => ({}));
const defaultLoginHandover: HandoverLoginRow[] = blank(4, () => ({}));

const DetailField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <li style={{ marginBottom: '8pt' }}>
        <strong>{label}:</strong> {value || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </li>
);

export const EmployeeHandoverFormTemplate: React.FC<{ data?: EmployeeHandoverFormData }> = ({ data = {} }) => {
    // If the section is explicitly passed as an empty array [] (user removed it), hide it.
    // If data is empty object ({}) with undefined fields, show defaults.
    const tasks = data.tasks !== undefined ? data.tasks : defaultTasks;
    const documents = data.documents !== undefined ? data.documents : defaultDocuments;
    const fileHandover = data.fileHandover !== undefined ? data.fileHandover : defaultFileHandover;
    const loginHandover = data.loginHandover !== undefined ? data.loginHandover : defaultLoginHandover;

    const showTasks = tasks && tasks.length > 0;
    const showDocuments = documents && documents.length > 0;
    const showFileHandover = fileHandover && fileHandover.length > 0;
    const showLoginHandover = loginHandover && loginHandover.length > 0;

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
                EMPLOYEE HANDOVER FORM
            </p>

            <div style={{ display: 'flex', gap: '32px', margin: '0 0 16pt 0' }}>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, flex: 1 }}>
                    <DetailField label="Employee Name" value={(data.employeeTitle ? `${data.employeeTitle} ` : '') + (data.employeeName || '')} />
                    <DetailField label="Designation" value={data.designation} />
                    <DetailField label="Reporting Manager" value={data.reportingManager} />
                </ul>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, flex: 1 }}>
                    <DetailField label="Employee ID" value={data.employeeId} />
                    <DetailField label="Department" value={data.department} />
                    <DetailField label="Last Working Date" value={data.lastWorkingDate} />
                </ul>
            </div>

            {showTasks && (
                <>
                    <p className="hf-section">WORK &amp; RESPONSIBILITY HANDOVER:</p>
                    <table className="hf-table">
                        <thead>
                            <tr>
                                <th style={{ width: '7%' }}>Sr. No.</th>
                                <th>Task / Responsibility</th>
                                <th style={{ width: '18%' }}>Status (Completed / Pending)</th>
                                <th style={{ width: '20%' }}>Handover To (Name &amp; Dept.)</th>
                                <th style={{ width: '16%' }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((r, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{r.task || '\u00A0'}</td>
                                    <td>{r.status || '\u00A0'}</td>
                                    <td>{r.handoverTo || '\u00A0'}</td>
                                    <td>{r.remarks || '\u00A0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {showDocuments && (
                <>
                    <p className="hf-section">DOCUMENTS / SYSTEM / ACCESS HANDOVER:</p>
                    <table className="hf-table">
                        <thead>
                            <tr>
                                <th style={{ width: '7%' }}>Sr. No.</th>
                                <th>Item</th>
                                <th style={{ width: '16%' }}>Handed Over (Yes / No)</th>
                                <th style={{ width: '20%' }}>Receiver Name</th>
                                <th style={{ width: '16%' }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((r, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{r.item || '\u00A0'}</td>
                                    <td>{r.handedOver || '\u00A0'}</td>
                                    <td>{r.receiverName || '\u00A0'}</td>
                                    <td>{r.remarks || '\u00A0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {showFileHandover && (
                <>
                    <p className="hf-section">FILE / SYSTEM HANDOVER (File Path / Location):</p>
                    <table className="hf-table">
                        <thead>
                            <tr>
                                <th style={{ width: '7%' }}>Sr. No.</th>
                                <th>System / Access</th>
                                <th style={{ width: '16%' }}>Handed Over (Yes / No)</th>
                                <th style={{ width: '24%' }}>File Path / Location</th>
                                <th style={{ width: '16%' }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fileHandover.map((r, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{r.systemAccess || '\u00A0'}</td>
                                    <td>{r.handedOver || '\u00A0'}</td>
                                    <td>{r.filePath || '\u00A0'}</td>
                                    <td>{r.remarks || '\u00A0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {showLoginHandover && (
                <>
                    <p className="hf-section">EMAIL / LOGIN / PASSWORD HANDOVER:</p>
                    <table className="hf-table">
                        <thead>
                            <tr>
                                <th style={{ width: '7%' }}>Sr. No.</th>
                                <th>Email ID / Login ID</th>
                                <th style={{ width: '16%' }}>Handed Over (Yes / No)</th>
                                <th style={{ width: '20%' }}>Password</th>
                                <th style={{ width: '16%' }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginHandover.map((r, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{r.loginId || '\u00A0'}</td>
                                    <td>{r.handedOver || '\u00A0'}</td>
                                    <td>{r.password || '\u00A0'}</td>
                                    <td>{r.remarks || '\u00A0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <p className="hf-section">HANDOVER CONFIRMATION</p>
            <div className="hf-avoid" style={{ display: 'flex', flexDirection: 'column', gap: '20pt', marginBottom: '20pt' }}>
                <div>
                    <p style={{ fontWeight: 700, margin: '0 0 8pt 0' }}>Handed Over By (Employee)</p>
                    <p style={{ margin: '0 0 16pt 0' }}>Name: {data.handedOverByName || '_____________________'}</p>
                    <p style={{ margin: '0 0 16pt 0' }}>Signature: _____________________</p>
                    <p style={{ margin: 0 }}>Date: _____________________</p>
                </div>
                <div>
                    <p style={{ fontWeight: 700, margin: '0 0 8pt 0' }}>Handed Over To (Receiver)</p>
                    <p style={{ margin: '0 0 16pt 0' }}>Name: {data.handedOverToName || '_____________________'}</p>
                    <p style={{ margin: '0 0 16pt 0' }}>Signature: _____________________</p>
                    <p style={{ margin: 0 }}>Date: _____________________</p>
                </div>
            </div>

            <p className="hf-section">CONFIRMATION:</p>
            <div className="hf-avoid" style={{ display: 'flex', flexDirection: 'column', gap: '20pt', marginTop: '30pt' }}>
                <p style={{ fontWeight: 700, margin: 0 }}>Reporting Manager Signature</p>
                <p style={{ fontWeight: 700, margin: 0 }}>HR Signature</p>
            </div>
        </LetterHeadLayout>
    );
};