import type { Education, Experience, PersonalInfo, Project, Skills } from "../../../apis/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Cv1({ toGenerate, personalInfo, experience, education, projects, skills }: { toGenerate?: boolean, personalInfo: PersonalInfo, experience: Experience[], education: Education[], projects: Project[], skills?: Skills }) {
    const { name, email, phone, github, jobTitle } = personalInfo;

    return (
        <div className={`bg-white text-[13px] leading-[1.15rem] shadow-lg print:shadow-none ${toGenerate ? "cv-constraints" : "2xl:scale-95 p-10 cv-constraints-web"}`}>
            {/* Header */}
            <header className="text-center mb-4">
                <h1 className={`font-bold tracking-tight ${toGenerate ? "text-4xl" : "text-3xl"}`}>{name}</h1>
                <p className={`text-gray-600 font-bold ${toGenerate ? "text-xl" : "text-lg"}`}>{jobTitle}</p>
                <div className={`${toGenerate ? "text-[16px]" : "text-[14px]"}`}>
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
            <div className={`space-y-5 ${toGenerate ? "text-[16px]" : "text-sm"}`}>
                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <h2 className={`font-bold tracking-wide border-b border-black mb-2 italic ${toGenerate ? "text-[17px]" : ""}`}>Education</h2>
                        <div className="mt-2 space-y-5">
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
                                        <div className="markdown-content mt-1">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{edu.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <h2 className={`font-bold tracking-wide border-b border-black mb-2 italic ${toGenerate ? "text-[17px]" : ""}`}>Experience</h2>
                        <div className="mt-2 space-y-4">
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
                                        <div className="markdown-content mt-1">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{exp.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h2 className={`font-bold tracking-wide border-b border-black mb-2 italic ${toGenerate ? "text-[17px]" : ""}`}>Projects</h2>
                        <div className="mt-2 space-y-4">
                            {projects.map((proj) => (
                                <div key={proj.id}>
                                    <div className="font-bold">{`${proj.name} ${proj.technologies && proj.technologies.length > 0 ? `(${proj.technologies.join(", ")})` : ""}`}</div>
                                    {proj.description && (
                                        <div className="markdown-content mt-1">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{proj.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills?.description && (
                    <section>
                        <h2 className={`font-bold tracking-wide border-b border-black mb-2 italic ${toGenerate ? "text-[17px]" : ""}`}>Skills</h2>
                        <div className="markdown-content mt-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{skills.description}</ReactMarkdown>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}