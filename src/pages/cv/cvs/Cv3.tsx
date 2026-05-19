import MarkdownRender from "../../../ui/cv-sections/MarkdownRender";
import { memo, useMemo, Fragment } from "react";
import { isAnyFieldFilled } from "../../../utils/cv.utils";
import { normalizeSectionOrder, type CvSectionId } from "../../../apis/cvApi";
import type { CvTemplateProps } from "../cvTemplateTypes";

const L = "w-[27%] whitespace-nowrap flex-shrink-0 pr-6";
const R = "flex-1 min-w-0";

function SectionLabel({ text }: { text: string }) {
    return (
        <span className="text-[15px] font-bold uppercase text-gray-900 leading-tight">
            {text}
        </span>
    );
}

function EntryDate({ start, end }: { start?: string; end?: string }) {
    const text = [start, end].filter(Boolean).join(" — ");
    if (!text) return null;
    return <p className="text-[12px] text-gray-900 leading-snug">{text}</p>;
}

function levelLabel(level?: number): string {
    const l = Math.min(5, Math.max(1, level ?? 3));
    if (l <= 1) return "Beginner";
    if (l <= 2) return "Elementary";
    if (l <= 3) return "Intermediate";
    if (l <= 4) return "Experienced";
    return "Expert";
}

function Cv3({
    personalInfo,
    professionalSummary,
    sectionOrder: sectionOrderProp,
    experience,
    education,
    projects,
    skills,
    references,
}: CvTemplateProps) {
    const sectionOrder = useMemo(() => normalizeSectionOrder(sectionOrderProp), [sectionOrderProp]);

    const validExperience = useMemo(() => experience.filter(isAnyFieldFilled), [experience]);
    const validEducation  = useMemo(() => education.filter(isAnyFieldFilled),  [education]);
    const validProjects   = useMemo(() => projects.filter(isAnyFieldFilled),   [projects]);
    const validSkills     = useMemo(() => skills.filter(isAnyFieldFilled),     [skills]);
    const validReferences = useMemo(() => references.filter(isAnyFieldFilled), [references]);

    const { firstName, lastName, email, phone, links } = personalInfo;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const contactParts = [phone, email, ...(links ?? []).filter(Boolean)].filter(Boolean) as string[];

    const renderSection = (sectionId: CvSectionId) => {
        switch (sectionId) {
            case "professionalSummary":
                return professionalSummary?.trim() ? (
                    <div className="mt-4">
                        <hr />
                        <div className="flex pt-3 gap-0">
                            <div className={L}><SectionLabel text="Profile" /></div>
                            <div className={`${R} text-[13px] leading-relaxed`}>
                                <MarkdownRender content={professionalSummary} />
                            </div>
                        </div>
                    </div>
                ) : null;

            case "experience":
                return validExperience.length > 0 ? (
                    <div className="mt-4">
                        <hr />
                        <div className="flex pt-3">
                            <div className={L}><SectionLabel text="Employment History" /></div>
                            <div className={R} />
                        </div>
                        {validExperience.map((exp) => (
                            <div key={exp.id} className="flex mt-3">
                                <div className={L}>
                                    <EntryDate start={exp.startDate} end={exp.endDate} />
                                </div>
                                <div className={R}>
                                    <p className="font-bold text-[14px] leading-snug">
                                        {[exp.jobTitle, exp.company].filter(Boolean).join(", ")}
                                    </p>
                                    {exp.city && (
                                        <p className="text-[12px] text-gray-500 mt-0.5">{exp.city}</p>
                                    )}
                                    {exp.description && (
                                        <MarkdownRender content={exp.description} className="mt-1 text-[13px]" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;

            case "education":
                return validEducation.length > 0 ? (
                    <div className="mt-4">
                        <hr />
                        <div className="flex pt-3">
                            <div className={L}><SectionLabel text="Education" /></div>
                            <div className={R} />
                        </div>
                        {validEducation.map((edu) => (
                            <div key={edu.id} className="flex mt-3">
                                <div className={L}>
                                    <EntryDate start={edu.startDate} end={edu.endDate} />
                                </div>
                                <div className={R}>
                                    <p className="font-bold text-[14px] leading-snug">
                                        {[
                                            edu.degree && edu.fieldOfStudy
                                                ? `${edu.degree} in ${edu.fieldOfStudy}`
                                                : edu.degree || edu.fieldOfStudy,
                                            edu.school,
                                        ].filter(Boolean).join(", ")}
                                    </p>
                                    {edu.description && (
                                        <MarkdownRender content={edu.description} className="mt-1 text-[13px]" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;

            case "projects":
                return validProjects.length > 0 ? (
                    <div className="mt-4">
                        <hr />
                        <div className="flex pt-3">
                            <div className={L}><SectionLabel text="Projects" /></div>
                            <div className={R} />
                        </div>
                        {validProjects.map((proj) => (
                            <div key={proj.id} className="flex mt-3">
                                <div className={L} />
                                <div className={R}>
                                    <p className="font-bold text-[14px] leading-snug">
                                        {proj.name}
                                        {proj.technologies?.length ? ` (${proj.technologies.join(", ")})` : ""}
                                    </p>
                                    {proj.description && (
                                        <MarkdownRender content={proj.description} className="mt-1 text-[13px]" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;

            case "skills":
                return validSkills.length > 0 ? (
                    <div className="mt-4">
                        <hr />
                        <div className="flex pt-3">
                            <div className={L}><SectionLabel text="Skills" /></div>
                            <div className={R}>
                                <div className="grid grid-cols-2 gap-x-14">
                                    {validSkills.map((skill) => (
                                        <div key={skill.id} className="flex justify-between items-baseline py-[3px] text-[13px]">
                                            <span className="font-medium">
                                                {skill.description}
                                            </span>
                                            <span className="ml-2 whitespace-nowrap text-right">
                                                {levelLabel(skill.level)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null;

            case "references":
                return validReferences.length > 0 ? (
                    <div className="mt-4">
                        <hr />
                        <div className="flex pt-3">
                            <div className={L}><SectionLabel text="References" /></div>
                            <div className={R} />
                        </div>
                        {validReferences.map((ref) => (
                            <div key={ref.id} className="flex mt-3">
                                <div className={L} />
                                <div className={R}>
                                    <p className="font-bold text-[14px] leading-snug">
                                        {[ref.name, ref.company].filter(Boolean).join(" | ")}
                                    </p>
                                    <p className="text-[13px] mt-0.5">
                                        {ref.email && (
                                            <a className="underline" href={`mailto:${ref.email}`}>{ref.email}</a>
                                        )}
                                        {ref.email && ref.phone && " | "}
                                        {ref.phone}
                                    </p>
                                    {ref.description && (
                                        <MarkdownRender content={ref.description} className="mt-1 text-[13px]" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <div className="cv-print-surface cv-print-root" style={{ fontFamily: "'Merriweather', serif" }}>
            <header className="text-center mb-2">
                {fullName && (
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
                        {fullName}
                    </h1>
                )}
                {contactParts.length > 0 && (
                    <p className="text-[13px] mt-1">
                        {contactParts.map((part, i) => (
                            <Fragment key={i}>
                                {i > 0 && <span>, </span>}
                                {part.includes("@") ? (
                                    <a className="text-blue-600 underline" href={`mailto:${part}`}>{part}</a>
                                ) : part.startsWith("http") ? (
                                    <a className="text-blue-600 underline" href={part} target="_blank" rel="noopener noreferrer">{part}</a>
                                ) : (
                                    <span>{part}</span>
                                )}
                            </Fragment>
                        ))}
                    </p>
                )}
            </header>

            <div>
                {sectionOrder.map((sid) => (
                    <Fragment key={sid}>{renderSection(sid)}</Fragment>
                ))}
            </div>
        </div>
    );
}

export default memo(Cv3);
