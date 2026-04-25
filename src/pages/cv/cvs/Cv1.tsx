import SectionTitle from "../../../ui/cv-sections/SectionTitle";
import SectionListContainer from "../../../ui/cv-sections/SectionListContainer";
import MarkdownRender from "../../../ui/cv-sections/MarkdownRender";
import { memo, useMemo, Fragment } from "react";
import { isAnyFieldFilled } from "../../../utils/cv.utils";
import { normalizeSectionOrder, type CvSectionId } from "../../../apis/cvApi";
import type { CvTemplateProps } from "../cvTemplateTypes";

function Cv1({
    variant = "embedded",
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

    const { firstName, lastName, email, phone, links, jobTitle } = personalInfo;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    const renderSection = (sectionId: CvSectionId) => {
        switch (sectionId) {
            case "professionalSummary":
                return (
                    professionalSummary?.trim() && (
                        <section className="cv-avoid-break">
                            <SectionTitle title="Professional Summary" />
                            <MarkdownRender content={professionalSummary} />
                        </section>
                    )
                );
            case "experience":
                return (
                    validExperience.length > 0 && (
                        <section className="cv-avoid-break">
                            <SectionTitle title="Experience" />
                            <SectionListContainer>
                                {validExperience.map((exp) => (
                                    <div key={exp.id} className="cv-entry-avoid-break">
                                        <div className="flex justify-between">
                                            <div>
                                                <span className="font-bold">{exp.jobTitle}</span>
                                                {exp.company && <span> | {exp.company}</span>}
                                            </div>
                                            <div className="whitespace-nowrap">
                                                {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                                            </div>
                                        </div>
                                        <div className="mt-0.5">{exp.city}</div>
                                        {exp.description && (
                                            <MarkdownRender content={exp.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </SectionListContainer>
                        </section>
                    )
                );
            case "education":
                return (
                    validEducation.length > 0 && (
                        <section className="cv-avoid-break">
                            <SectionTitle title="Education" />
                            <SectionListContainer>
                                {validEducation.map((edu) => (
                                    <div key={edu.id} className="cv-entry-avoid-break">
                                        <div className="flex justify-between">
                                            <div>
                                                <span className="font-bold">{edu.school}</span>
                                                {edu.degree && <span> — {edu.degree}</span>}
                                                {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                                            </div>
                                            <div>
                                                {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                                            </div>
                                        </div>
                                        {edu.description && (
                                            <MarkdownRender content={edu.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </SectionListContainer>
                        </section>
                    )
                );
            case "projects":
                return (
                    validProjects.length > 0 && (
                        <section className="cv-avoid-break">
                            <SectionTitle title="Projects" />
                            <SectionListContainer>
                                {validProjects.map((proj) => (
                                    <div key={proj.id} className="cv-entry-avoid-break">
                                        <div className="font-bold">{`${proj.name} ${
                                            proj.technologies && proj.technologies.length > 0
                                                ? `(${proj.technologies.join(", ")})`
                                                : ""
                                        }`}</div>
                                        {proj.description && (
                                            <MarkdownRender content={proj.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </SectionListContainer>
                        </section>
                    )
                );
            case "skills":
                return (
                    validSkills.length > 0 && (
                        <section className="cv-avoid-break">
                            <SectionTitle title="Skills" />
                            <ul className="list-disc pl-5">
                                {validSkills.map((skill) => (
                                    <li key={skill.id}>{skill.description}</li>
                                ))}
                            </ul>
                        </section>
                    )
                );
            case "references":
                return (
                    validReferences.length > 0 && (
                        <section className="cv-avoid-break">
                            <SectionTitle title="References" />
                            <SectionListContainer>
                                {validReferences.map((ref) => (
                                    <div key={ref.id} className="cv-entry-avoid-break">
                                        <div className="flex justify-between">
                                            <div>
                                                <span className="font-bold">{ref.name}</span>
                                                {ref.company && <span> | {ref.company}</span>}
                                            </div>
                                        </div>
                                        <div className="mt-0.5">
                                            <a className="text-blue-600 underline" href={`mailto:${ref.email}`}>
                                                {ref.email}
                                            </a>{" "}
                                            {ref.phone ? ` | ${ref.phone}` : ""}
                                        </div>
                                        {ref.description && (
                                            <MarkdownRender content={ref.description} className="mt-1" />
                                        )}
                                    </div>
                                ))}
                            </SectionListContainer>
                        </section>
                    )
                );
            default:
                return null;
        }
    };

    const rootClass = variant === "print" ? "cv-print-surface cv-print-root" : "cv-print-surface cv-print-root";

    return (
        <div className={rootClass}>
            <header className="text-center mb-4 cv-avoid-break">
                <h1 className="font-bold tracking-tight text-4xl">{fullName}</h1>
                <p className="text-gray-600 font-bold text-xl">{jobTitle}</p>
                <div className="text-[16px]">
                    <span>{phone}</span>
                    {email && (
                        <>
                            {phone && email && <span> | </span>}
                            <a className="text-blue-600 underline" href={`mailto:${email}`}>
                                {email}
                            </a>
                        </>
                    )}
                </div>
                <div className="text-[16px]">
                    {links
                        ?.filter((link) => link?.trim())
                        .map((link, index) => (
                            <span key={index}>
                                {index > 0 && <span> | </span>}
                                <a className="text-blue-600 underline" href={link} target="_blank" rel="noopener noreferrer">
                                    {link}
                                </a>
                            </span>
                        ))}
                </div>
            </header>

            <div className="text-[16px] space-y-5 leading-[1.15rem]">
                {sectionOrder.map((sid) => (
                    <Fragment key={sid}>{renderSection(sid)}</Fragment>
                ))}
            </div>
        </div>
    );
}

export default memo(Cv1);
