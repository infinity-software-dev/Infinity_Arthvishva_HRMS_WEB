import React from 'react';

interface EmployeeAcceptanceProps {
    name: string;
}

export const EmployeeAcceptance: React.FC<EmployeeAcceptanceProps> = ({ name }) => {
    return (
        <div style={{ marginTop: '16pt', pageBreakInside: 'avoid', breakInside: 'avoid' }} className="ap-avoid">
            <p style={{ fontWeight: 700, margin: '0 0 4pt 0' }}>Employee Acceptance</p>
            <p style={{ margin: '0 0 8pt 0', textAlign: 'justify' }}>
                I, <strong>{name}</strong>, hereby confirm that I have read, understood, and accepted the above terms and conditions of employment.
            </p>
            <p style={{ margin: '0 0 4pt 0' }}>Employee Signature: ______________________</p>
            <p style={{ margin: '0 0 4pt 0' }}>Name: {name}</p>
            <p style={{ margin: 0 }}>Date: ________________________</p>
        </div>
    );
};
