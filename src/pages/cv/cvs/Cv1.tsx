import type { Education, Experience, PersonalInfo, Project, Skills } from "../../../apis/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SectionTitle from "../../../ui/cv-sections/SectionTitle";
import SectionListContainer from "../../../ui/cv-sections/SectionListContainer";

export default function Cv1({ toGenerate, personalInfo, experience, education, projects, skills }: { toGenerate?: boolean, personalInfo: PersonalInfo, experience: Experience[], education: Education[], projects: Project[], skills?: Skills }) {
    const { name, email, phone, github, jobTitle } = personalInfo;

    return (
        <div className={`bg-white ${toGenerate ? "leading-[1.15rem] cv-constraints" : "cv-constraints-web"}`}>
            <div className="inner-cv-constraints-web overflow-hidden">
            {/* Header */}
            <header className={`text-center ${toGenerate ? "mb-4" : "mb-2"}`}>
                <h1 className={`font-bold tracking-tight ${toGenerate ? "text-4xl" : "text-xl"}`}>{name}</h1>
                <p className={`text-gray-600 font-bold ${toGenerate ? "text-xl" : "text-xs"}`}>{jobTitle}</p>
                <div className={`${toGenerate ? "text-[16px]" : "text-[10px]"}`}>
                    <span>{phone}</span>
                    {email && (
                        <>
                            <span> | </span>
                            <a className="text-blue-600 underline" href={`mailto:${email}`}>
                                {email}
                            </a>
                        </>
                    )}
                    {github && (
                        <>
                            <span> | </span>
                            <a className="text-blue-600 underline" href={github} target="_blank" rel="noopener noreferrer">
                                {github}
                            </a>
                        </>
                    )}
                </div>
            </header>

            {/* Sections */}
            <div className={`${toGenerate ? "text-[16px] space-y-5" : "text-[10px] space-y-1"}`}>
                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <SectionTitle title="Education" toGenerate={toGenerate} />
                        <SectionListContainer toGenerate={toGenerate}>
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{edu.school}</span>
                                            {edu.degree && <span> — {edu.degree}</span>}
                                            {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                                        </div>
                                        <div>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
                                    </div>
                                    {edu.description && (
                                        <div className={`markdown-content ${toGenerate ? "mt-1" : ""}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{edu.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SectionListContainer>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <SectionTitle title="Experience" toGenerate={toGenerate} />
                        <SectionListContainer toGenerate={toGenerate}>
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{exp.jobTitle}</span>
                                            {exp.company && <span> | {exp.company}</span>}
                                        </div>
                                        <div className="whitespace-nowrap">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}</div>
                                    </div>
                                    <div>{exp.city}</div>
                                    {exp.description && (
                                        <div className={`markdown-content ${toGenerate ? "mt-1" : ""}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{exp.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SectionListContainer>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <SectionTitle title="Projects" toGenerate={toGenerate} />
                        <SectionListContainer toGenerate={toGenerate}>
                            {projects.map((proj) => (
                                <div key={proj.id}>
                                    <div className="font-bold">{`${proj.name} ${proj.technologies && proj.technologies.length > 0 ? `(${proj.technologies.join(", ")})` : ""}`}</div>
                                    {proj.description && (
                                        <div className={`markdown-content ${toGenerate ? "mt-1" : ""}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{proj.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SectionListContainer>
                    </section>
                )}

                {/* Skills */}
                {skills?.description && (
                    <section>
                        <SectionTitle title="Skills" toGenerate={toGenerate} />
                        <div className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{skills.description}</ReactMarkdown>
                        </div>
                    </section>
                )}
            </div>
            </div>
        </div>
    );
}