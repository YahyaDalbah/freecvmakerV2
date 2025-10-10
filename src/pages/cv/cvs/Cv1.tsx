import type { Education, Experience, PersonalInfo, Project, Skill } from "../../../apis/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SectionTitle from "../../../ui/cv-sections/SectionTitle";
import SectionListContainer from "../../../ui/cv-sections/SectionListContainer";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Cv1({ toGenerate, personalInfo, experience, education, projects, skills }: { toGenerate?: boolean, personalInfo: PersonalInfo, experience: Experience[], education: Education[], projects: Project[], skills: Skill[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const pages = [
        { personalInfo, experience, education, projects, skills },
        { personalInfo, experience: [], education: [], projects: [], skills: [] },
        { personalInfo, experience: [], education, projects, skills: [] }
    ];

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <CvPage 
                toGenerate={toGenerate} 
                personalInfo={pages[currentPage - 1].personalInfo} 
                experience={pages[currentPage - 1].experience} 
                education={pages[currentPage - 1].education} 
                projects={pages[currentPage - 1].projects} 
                skills={pages[currentPage - 1].skills} 
            />
            {!toGenerate && (
                <div className="flex items-center justify-center gap-3 fixed bottom-3">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md transition-colors ${
                            currentPage === 1 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-600 text-white hover:bg-gray-500 cursor-pointer'
                        }`}
                        aria-label="Previous page"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`w-10 h-10 rounded-md transition-colors cursor-pointer ${
                                    currentPage === page
                                        ? 'bg-blue-500 text-white font-semibold'
                                        : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                }`}
                                aria-label={`Go to page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-md transition-colors ${
                            currentPage === totalPages 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-600 text-white hover:bg-gray-500 cursor-pointer'
                        }`}
                        aria-label="Next page"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            )}
        </>
    );
}

function CvPage({ toGenerate, personalInfo, experience, education, projects, skills }: { toGenerate?: boolean, personalInfo: PersonalInfo, experience: Experience[], education: Education[], projects: Project[], skills: Skill[] }) {

    const { name, email, phone, github, jobTitle } = personalInfo;
    const innerRef = useRef<HTMLDivElement | null>(null);
    const skillsRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        const container = innerRef.current;
        const skillsContainer = skillsRef.current;
        if (!container) return;

        const check = () => {
            const hasOverflow = container.scrollHeight > container.clientHeight;
            if (!skillsContainer) {
                if (hasOverflow) {
                    console.log("CV overflow detected (no skills list ref attached)");
                }
                return;
            }
            const items = Array.from(skillsContainer.querySelectorAll('li')) as HTMLElement[];
            const containerHeight = container.clientHeight + 32;
            const overflowItems: { index: number, type: 'full' | 'partial' }[] = [];
            items.forEach((el, idx) => {
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (bottom > containerHeight) {
                    const type: 'full' | 'partial' = top < containerHeight ? 'partial' : 'full';
                    overflowItems.push({ index: idx, type });
                }
            });
            console.log(overflowItems);
            return hasOverflow;
        };

        check();
        const onResize = () => check();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [skills, education, experience, projects]);

    function isAnyFieldFilled(section: any) {
        return Object.keys(section).some(key => {
            if (key === 'id') return false;
      
            const value = section[key];
      
            if (value === undefined || value === null) return false;
      
            if (typeof value === 'string') {
              return value.trim() !== '';
            }
      
            if (Array.isArray(value)) {
              return value.some(v => typeof v === 'string' && v.trim() !== '');
            }
      
            return false;
        })
      }
    
    return (
        <div className={`bg-white leading-[1.15rem] ${toGenerate ? "cv-constraints" : "cv-constraints-web p-8 scale-71 origin-top fixed top-10"}`}>
            <div ref={innerRef} className={`inner-cv-constraints-web ${toGenerate ? "" : "overflow-hidden"}`}>
            {/* Header */}
            <header className="text-center mb-4">
                <h1 className="font-bold tracking-tight text-4xl">{name}</h1>
                <p className="text-gray-600 font-bold text-xl">{jobTitle}</p>
                <div className="text-[16px]">
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
            <div className="text-[16px] space-y-5">

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <SectionTitle title="Experience" />
                        <SectionListContainer>
                            {experience.map((exp) => isAnyFieldFilled(exp) && (
                                <div key={exp.id}>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{exp.jobTitle}</span>
                                            {exp.company && <span> | {exp.company}</span>}
                                        </div>
                                        <div className="whitespace-nowrap">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}</div>
                                    </div>
                                    <div className="mt-0.5">{exp.city}</div>
                                    {exp.description && (
                                        <div className="markdown-content mt-1">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{exp.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SectionListContainer>
                    </section>
                )}
                
                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <SectionTitle title="Education" />
                        <SectionListContainer>
                            {education.map((edu) => isAnyFieldFilled(edu) && (
                                <div key={edu.id}>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{edu.school}</span>
                                            {edu.degree && <span> — {edu.degree}</span>}
                                            {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                                        </div>
                                        <div >{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
                                    </div>
                                    {edu.description && (
                                        <div className="markdown-content mt-1">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{edu.description}</ReactMarkdown>
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
                        <SectionTitle title="Projects" />
                        <SectionListContainer>
                            {projects.map((proj) => isAnyFieldFilled(proj) && (
                                <div key={proj.id}>
                                    <div className="font-bold">{`${proj.name} ${proj.technologies && proj.technologies.length > 0 ? `(${proj.technologies.join(", ")})` : ""}`}</div>
                                    {proj.description && (
                                        <div className="markdown-content mt-1">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{proj.description}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SectionListContainer>
                    </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <section ref={skillsRef}>
                        <SectionTitle title="Skills" />
                        <ul className="list-disc pl-5">
                            {skills.map((skill) => isAnyFieldFilled(skill) && (
                                <li key={skill.id}>{skill.description}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
            </div>
        </div>

    );
}
