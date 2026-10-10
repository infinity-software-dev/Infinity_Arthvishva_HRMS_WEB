import React from 'react';

export interface SalaryRow {
    monthly: string | number;
    yearly: string | number;
}

export interface SalaryAnnexureData {
    basic: SalaryRow;
    da: SalaryRow;
    hra: SalaryRow;
    conveyance: SalaryRow;
    medical: SalaryRow;
    mobile: SalaryRow;
    grossEarnings: SalaryRow;

    empPf: SalaryRow;
    empEsic: SalaryRow;
    pt: SalaryRow;
    tds: SalaryRow;
    grossDeduction: SalaryRow;

    netSalary: SalaryRow;

    employerPf: SalaryRow;
    employerEsic: SalaryRow;
    gratuity: SalaryRow;
    bonus: SalaryRow;

    ctc: SalaryRow;
}

const TABLE_CSS = `
.sa-table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 10pt;
    text-align: center;
}
.sa-table th, .sa-table td {
    border: 1px solid #000;
    padding: 4px 8px;
    vertical-align: middle;
}
.sa-table th {
    font-weight: 700;
}
.sa-left {
    text-align: left;
}
.bg-blue, .bg-blue td {
    background-color: #E6F0FA;
    color: #000000;
    font-weight: bold;
}
.bg-yellow, .bg-yellow td {
    background-color: #FEF9E7;
    color: #000000;
    font-weight: bold;
}
.bg-green, .bg-green td {
    background-color: #E2F5F2;
    color: #000000;
    font-weight: bold;
}
`;

export const SalaryAnnexureTable: React.FC<{ data: SalaryAnnexureData }> = ({ data }) => {
    const renderRow = (label: string, row: SalaryRow, isBold = false) => (
        <tr>
            <td className="sa-left" style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{label}</td>
            <td style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{row.monthly || '0'}</td>
            <td style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{row.yearly || '0'}</td>
        </tr>
    );

    return (
        <div style={{ pageBreakInside: 'avoid' }}>
            <style>{TABLE_CSS}</style>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Annexure A – Detailed CTC & Salary Structure:</h3>
            <table className="sa-table">
                <thead>
                    <tr>
                        <th className="sa-left" style={{ width: '50%' }}>Annexure A</th>
                        <th style={{ width: '25%' }}>Monthly</th>
                        <th style={{ width: '25%' }}>Yearly</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRow('Basic', data.basic)}
                    {renderRow('DA (Dearness Allow)', data.da)}
                    {renderRow('HRA (House Rent Allow)', data.hra)}
                    {renderRow('Conveyance Allow', data.conveyance)}
                    {renderRow('Medical Allow', data.medical)}
                    {renderRow('Mobile & Other Allow', data.mobile)}
                    <tr className="bg-blue">
                        <td className="sa-left">Gross Earnings</td>
                        <td>{data.grossEarnings.monthly}</td>
                        <td>{data.grossEarnings.yearly}</td>
                    </tr>

                    <tr>
                        <th className="sa-left">Annexure B</th>
                        <th></th>
                        <th>0</th>
                    </tr>
                    {renderRow('Employee PF (12%)', data.empPf)}
                    {renderRow('Employee ESIC (0.75%)', data.empEsic)}
                    {renderRow('PT (Professional Tax)', data.pt)}
                    {renderRow('Income Tax/ TDS', data.tds)}
                    <tr className="bg-yellow">
                        <td className="sa-left">Gross Deduction</td>
                        <td>{data.grossDeduction.monthly}</td>
                        <td>{data.grossDeduction.yearly}</td>
                    </tr>
                    
                    <tr className="bg-green">
                        <td className="sa-left">Net in Hand Salary</td>
                        <td>{data.netSalary.monthly}</td>
                        <td>{data.netSalary.yearly}</td>
                    </tr>

                    <tr>
                        <td></td>
                        <td></td>
                        <td>0</td>
                    </tr>
                    {renderRow('Employer PF (13%)', data.employerPf)}
                    {renderRow('Employer ESIC (3.25%)', data.employerEsic)}
                    {renderRow('Gratuity', data.gratuity)}
                    {renderRow('Satuatory Bonus', data.bonus)}
                    
                    <tr className="bg-blue">
                        <td className="sa-left">CTC</td>
                        <td>{data.ctc.monthly}</td>
                        <td>{data.ctc.yearly}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
