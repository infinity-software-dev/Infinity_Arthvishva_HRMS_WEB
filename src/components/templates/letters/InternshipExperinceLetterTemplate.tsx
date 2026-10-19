import React from "react";
import { LetterHeadLayout } from "@/components/templates/LetterHeadLayout";

export interface InternshipExperienceLetterData {
    date: string; // e.g. YYYY-MM-DD or 20/09/2026
    employeeTitle: string; // Mr. / Ms. / Mrs.
    employeeName: string;
    employeeId?: string;
    duration: string; // e.g. "two-month", "3 months"
    startDate: string; // e.g. YYYY-MM-DD or 20/07/2026
    endDate: string; // e.g. YYYY-MM-DD or 20/09/2026
    designation: string; // e.g. "Finance Intern"
    department: string; // e.g. "Motor Insurance"
    activitySummary?: string; // e.g. "motor insurance operations and customer servicing"
    responsibilities: string[]; // bullet list under "Key Responsibilities and Activities Performed"
    gender?: "male" | "female";
    employeeEmail?: string;
}

const BODY_LINE = 1.6;

const P: React.FC<{
    align?: "left" | "justify" | "center" | "right";
    body?: boolean;
    children?: React.ReactNode;
}> = ({ align = "left", body, children }) => (
    <p
        style={{
            margin: "0 0 10pt 0",
            textAlign: align,
            lineHeight: body ? BODY_LINE : undefined,
        }}
    >
        {children ?? "\u00A0"}
    </p>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <strong>{children}</strong>
);

const pronouns = (title: string, gender?: "male" | "female") => {
    const male = gender ? gender === "male" : /^mr\.?$/i.test(title.trim());
    return male
        ? { he: "he", He: "He", his: "his", him: "him" }
        : { he: "she", He: "She", his: "her", him: "her" };
};

const aOrAn = (word: string) => (/^[aeiou]/i.test(word.trim()) ? "an" : "a");

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

export const InternshipExperienceLetterTemplate: React.FC<{
    data: InternshipExperienceLetterData;
}> = ({ data }) => {
    const p = pronouns(data.employeeTitle || "Mr.", data.gender);
    const fullName = `${data.employeeTitle ? `${data.employeeTitle} ` : ""}${data.employeeName || ""}`.trim();
    const summary =
        data.activitySummary || "motor insurance operations and customer servicing";

    const displayDate = formatDisplayDate(data.date);
    const displayStartDate = formatDisplayDate(data.startDate);
    const displayEndDate = formatDisplayDate(data.endDate);

    return (
        <LetterHeadLayout>
            <p
                style={{
                    margin: "0 0 16pt 0",
                    textAlign: "center",
                    fontSize: "16pt",
                    fontWeight: 700,
                    color: "#2F5496",
                    textDecoration: "underline",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                }}
            >
                INTERNSHIP EXPERIENCE LETTER
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12pt" }}>
                <span style={{ fontWeight: 600 }}>Date: {displayDate}</span>
            </div>

            <p
                style={{
                    textAlign: "center",
                    fontWeight: 700,
                    margin: "12pt 0",
                    fontSize: "12pt",
                }}
            >
                TO WHOMSOEVER IT MAY CONCERN
            </p>

            <P align="justify" body>
                This is to certify that <B>{fullName}</B>{data.employeeId ? <> (Employee ID: <B>{data.employeeId}</B>)</> : ''} has successfully completed a{" "}
                <B>{data.duration || "internship"}</B> internship with <B>Infinity Arthvishva</B> from{" "}
                <B>
                    {displayStartDate} to {displayEndDate}
                </B>{" "}
                as {aOrAn(data.designation || "")} <B>{data.designation}</B>.
            </P>

            <P align="justify" body>
                During the internship period, {p.he} was associated with the{" "}
                <B>{data.department} Department</B> and was involved in various activities
                related to {summary}.
            </P>

            {data.responsibilities && data.responsibilities.length > 0 && (
                <div style={{ margin: "12pt 0" }}>
                    <p
                        style={{
                            fontWeight: 700,
                            fontSize: "11pt",
                            margin: "0 0 6pt 0",
                        }}
                    >
                        Key Responsibilities and Activities Performed:
                    </p>
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: "16px",
                            listStyle: "none",
                            lineHeight: BODY_LINE,
                        }}
                    >
                        {data.responsibilities.map((r, i) => (
                            <li
                                key={i}
                                style={{
                                    marginBottom: "4pt",
                                    textAlign: "justify",
                                    display: "flex",
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        marginRight: "8px",
                                        fontWeight: 700,
                                        userSelect: "none",
                                        flexShrink: 0,
                                        lineHeight: BODY_LINE,
                                    }}
                                >
                                    •
                                </span>
                                <span>{r.replace(/^•\s*/, "")}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <P align="justify" body>
                During the internship, <B>{fullName}</B> demonstrated a positive attitude towards
                learning, professionalism, responsibility, and willingness to take up assigned
                tasks. {p.He} carried out {p.his} duties with dedication and maintained a professional
                approach throughout {p.his} internship tenure.
            </P>

            <P align="justify" body>
                We appreciate {p.his} contribution during the internship and wish {p.him} success in
                all future academic and professional endeavours.
            </P>
            <P align="justify" />

            <div style={{ marginTop: "16pt", pageBreakInside: "avoid" }}>
                <P align="justify">Regards,</P>
                <P align="justify">Infinity Arthvishva</P>
            </div>
        </LetterHeadLayout>
    );
};
