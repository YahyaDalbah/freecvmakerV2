import MarkdownRender from "../../../ui/cv-sections/MarkdownRender";
import { memo, useMemo, Fragment, useRef, useLayoutEffect, useState } from "react";
import { isAnyFieldFilled } from "../../../utils/cv.utils";
import { normalizeSectionOrder, type CvSectionId } from "../../../apis/cvApi";
import type { CvTemplateProps } from "../cvTemplateTypes";
import { PAGE_H } from "../cvDimensions";

const DEFAULT_COLOR = "#1f0a14";

function DateRange({ start, end }: { start?: string; end?: string }) {
    const text = [start, end].filter(Boolean).join(" — ");
    if (!text) return null;
    return (
        <div className="text-[13px] uppercase tracking-wide mt-0.5 text-gray-500">
            {text}
        </div>
    );
}

function RightSectionHeading({ title }: { title: string }) {
    return (
        <h2 className="font-bold text-[19px] tracking-tight text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            {title}
        </h2>
    );
}

function SidebarHeading({ title }: { title: string }) {
    return (
        <h2 className="font-bold text-[15px] mb-2">
            {title}
        </h2>
    );
}

function Cv2({
    color,
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
    const validEducation = useMemo(() => education.filter(isAnyFieldFilled), [education]);
    const validProjects = useMemo(() => projects.filter(isAnyFieldFilled), [projects]);
    const validSkills = useMemo(() => skills.filter(isAnyFieldFilled), [skills]);
    const validReferences = useMemo(() => references.filter(isAnyFieldFilled), [references]);

    const rowRef = useRef<HTMLDivElement>(null);
    const [minH, setMinH] = useState(0);

    // Round the flex row's height up to the nearest A4-page boundary so the sidebar
    // background fills every page. Clears minHeight before measuring so flex-stretch
    // doesn't inflate scrollHeight, then restores it — runs before paint so no flicker.
    useLayoutEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        el.style.minHeight = '0px';
        const h = el.scrollHeight;
        el.style.minHeight = `${minH || PAGE_H}px`;
        const rounded = Math.max(1, Math.ceil(h / PAGE_H)) * PAGE_H;
        if (rounded !== minH) setMinH(rounded);
    });

    const { firstName, lastName, email, phone, links, city } = personalInfo;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const sidebarBg = color || DEFAULT_COLOR;

    const rightSectionOrder = useMemo(
        () => sectionOrder.filter((id) => id !== "skills"),
        [sectionOrder]
    );

    const filteredLinks = links?.filter((l) => l?.trim()) ?? [];

    const renderRightSection = (sectionId: CvSectionId) => {
        switch (sectionId) {
            case "professionalSummary":
                return (
                    professionalSummary?.trim() && (
                        <section>
                            <RightSectionHeading title="Profile" />
                            <MarkdownRender content={professionalSummary} />
                        </section>
                    )
                );
            case "experience":
                return (
                    validExperience.length > 0 && (
                        <section>
                            <RightSectionHeading title="Employment History" />
                            <div className="space-y-4">
                                {validExperience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="font-bold text-[15px]">
                                            {[exp.jobTitle, exp.company].filter(Boolean).join(", ")}
                                        </div>
                                        <DateRange start={exp.startDate} end={exp.endDate} />
                                        {exp.description && (
                                            <MarkdownRender content={exp.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                );
            case "education":
                return (
                    validEducation.length > 0 && (
                        <section>
                            <RightSectionHeading title="Education" />
                            <div className="space-y-4">
                                {validEducation.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-[15px]">
                                            {[
                                                edu.degree && edu.fieldOfStudy
                                                    ? `${edu.degree} in ${edu.fieldOfStudy}`
                                                    : edu.degree || edu.fieldOfStudy,
                                                edu.school,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </div>
                                        <DateRange start={edu.startDate} end={edu.endDate} />
                                        {edu.description && (
                                            <MarkdownRender content={edu.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                );
            case "projects":
                return (
                    validProjects.length > 0 && (
                        <section>
                            <RightSectionHeading title="Projects" />
                            <div className="space-y-4">
                                {validProjects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="font-bold text-[15px]">
                                            {proj.name}
                                            {proj.technologies && proj.technologies.length > 0
                                                ? ` (${proj.technologies.join(", ")})`
                                                : ""}
                                        </div>
                                        {proj.description && (
                                            <MarkdownRender content={proj.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                );
            case "references":
                return (
                    validReferences.length > 0 && (
                        <section>
                            <RightSectionHeading title="References" />
                            <div className="space-y-4">
                                {validReferences.map((ref) => (
                                    <div key={ref.id}>
                                        <div className="font-bold text-[15px]">
                                            {[ref.name, ref.company].filter(Boolean).join(" | ")}
                                        </div>
                                        <div className="mt-0.5 text-sm">
                                            {ref.email && (
                                                <a className="text-blue-600 underline" href={`mailto:${ref.email}`}>
                                                    {ref.email}
                                                </a>
                                            )}
                                            {ref.email && ref.phone && " | "}
                                            {ref.phone}
                                        </div>
                                        {ref.description && (
                                            <MarkdownRender content={ref.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                );
            default:
                return null;
        }
    };

    return (
        <div
            className="cv-print-surface cv-print-root"
            style={{ marginLeft: 0, marginRight: 0, width: "100%", maxWidth: "100%", fontFamily: "'Inter', sans-serif" }}
        >
            <div
                ref={rowRef}
                className="flex flex-row items-stretch text-[15px] leading-[1.3]"
                style={{ minHeight: minH || PAGE_H }}
            >
                {/* Sidebar */}
                <div
                    className="w-[30%] flex-shrink-0 px-5 py-6 space-y-5"
                    style={{
                        backgroundColor: sidebarBg,
                        color: "#ffffff",
                        printColorAdjust: "exact",
                        WebkitPrintColorAdjust: "exact",
                    }}
                >
                    {fullName && (
                        <h1 className="font-bold text-[22px] leading-tight text-white">{fullName}</h1>
                    )}

                    {(city || phone || email || filteredLinks.length > 0) && (
                        <div>
                            <SidebarHeading title="Details" />
                            <div className="space-y-1 text-[13px]">
                                {city && <div>{city}</div>}
                                {phone && <div>{phone}</div>}
                                {email && (
                                    <div>
                                        <a className="underline break-all" href={`mailto:${email}`} style={{ color: "#ffffff" }}>
                                            {email}
                                        </a>
                                    </div>
                                )}
                                {filteredLinks.map((link, i) => (
                                    <div key={i}>
                                        <a
                                            className="underline break-all"
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#ffffff" }}
                                        >
                                            {link}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {validSkills.length > 0 && (
                        <div>
                            <SidebarHeading title="Skills" />
                            <div className="space-y-2 text-[13px]">
                                {validSkills.map((skill) => {
                                    const level = Math.min(5, Math.max(1, skill.level ?? 3));
                                    const pct = (level / 5) * 100;
                                    return (
                                        <div key={skill.id}>
                                            <div>{skill.description}</div>
                                            <div className="mt-1 h-[3px] w-full rounded-full bg-white/20">
                                                <div
                                                    className="h-full rounded-full bg-white"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right main content */}
                <div className="flex-1 px-8 py-7 space-y-5 bg-white">
                    {rightSectionOrder.map((sid) => (
                        <Fragment key={sid}>{renderRightSection(sid)}</Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(Cv2);
