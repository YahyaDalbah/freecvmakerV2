import type { Education, Experience, PersonalInfo, Project, Skill } from "../../../apis/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SectionTitle from "../../../ui/cv-sections/SectionTitle";
import SectionListContainer from "../../../ui/cv-sections/SectionListContainer";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function isAnyFieldFilled(section: any): boolean {
    return Object.keys(section).some(key => {
        if (key === 'id') return false;
        const value = section[key];
        if (value === undefined || value === null) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.some(v => typeof v === 'string' && v.trim() !== '');
        return false;
    });
}

type PageContent = {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: Skill[];
    showExperienceTitle?: boolean;
    showEducationTitle?: boolean;
    showProjectsTitle?: boolean;
    showSkillsTitle?: boolean;
};

export default function Cv1({ toGenerate, personalInfo, experience, education, projects, skills }: { toGenerate?: boolean, personalInfo: PersonalInfo, experience: Experience[], education: Education[], projects: Project[], skills: Skill[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState<PageContent[]>([
        { personalInfo, experience, education, projects, skills }
    ]);

    // Calculate pagination based on content overflow by measuring actual rendered heights
    useEffect(() => {
        if (toGenerate) {
            // When generating PDF, show all content on one page
            setPages([{ personalInfo, experience, education, projects, skills }]);
            return;
        }

        const calculatePages = async () => {
            // Filter out empty items
            const validExperience = experience.filter(isAnyFieldFilled);
            const validEducation = education.filter(isAnyFieldFilled);
            const validProjects = projects.filter(isAnyFieldFilled);
            const validSkills = skills.filter(isAnyFieldFilled);

            // If no content, show single empty page
            if (validExperience.length === 0 && validEducation.length === 0 && 
                validProjects.length === 0 && validSkills.length === 0) {
                setPages([{ personalInfo, experience: [], education: [], projects: [], skills: [] }]);
                return;
            }

            // Create a measurement container
            const measureContainer = document.createElement('div');
            measureContainer.style.position = 'absolute';
            measureContainer.style.visibility = 'hidden';
            measureContainer.style.width = '210mm';
            measureContainer.style.left = '-9999px';
            document.body.appendChild(measureContainer);

            try {
                // Helper to measure height of content
                const measureHeight = (html: string): number => {
                    measureContainer.innerHTML = html;
                    return measureContainer.offsetHeight;
                };

                // Available height per page (accounting for padding and margins)
                // inner-cv-constraints-web height minus spacing
                const maxPageHeight = 320 * 3.7795275591 - 32; // Convert mm to px, subtract padding
                const sectionSpacing = 20; // 1.25rem = 20px spacing between sections
                const innerSectionSpacing = 16;
                const sectionTitleHeight = 26.4; // Approximate height for section title

                const newPages: PageContent[] = [];
                let currentHeight = 0;
                let currentPageContent: PageContent = {
                    personalInfo: {},
                    experience: [],
                    education: [],
                    projects: [],
                    skills: []
                };

                // Measure and add header (only on first page)
                const headerHtml = `
                    <div class="text-center mb-4">
                        <h1 class="font-bold tracking-tight text-4xl">${personalInfo.name || ''}</h1>
                        <p class="text-gray-600 font-bold text-xl">${personalInfo.jobTitle || ''}</p>
                        <div class="text-[16px]">${personalInfo.phone || ''}</div>
                    </div>
                `;
                const headerHeight = measureHeight(headerHtml);
                currentPageContent.personalInfo = personalInfo;
                currentHeight = headerHeight;

                // Process experiences
                if (validExperience.length > 0) {
                    currentHeight += sectionSpacing;
                    if (currentHeight + sectionTitleHeight > maxPageHeight) {
                        // Start new page
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                        currentHeight = 0;
                    }
                    currentPageContent.showExperienceTitle = true;
                    currentHeight += sectionTitleHeight;

                    for (const [index, exp] of validExperience.entries()) {
                        const expHtml = `
                            <div class="leading-[1.15rem] text-[16px]">
                                <div class="flex justify-between">
                                    <div><span class="font-bold">${exp.jobTitle || ''}</span>${exp.company ? ` | ${exp.company}` : ''}</div>
                                    <div>${exp.startDate || ''}${exp.endDate ? ` – ${exp.endDate}` : ''}</div>
                                </div>
                                <div class="mt-0.5">${exp.city || ''}</div>
                                <div class="mt-1">${exp.description || ''}</div>
                            </div>
                        `;
                        const expHeight = measureHeight(expHtml) + (index === validExperience.length - 1 ? 0 : innerSectionSpacing);

                        if (currentHeight + expHeight > maxPageHeight) {
                            // Start new page
                            newPages.push({ ...currentPageContent });
                            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                            currentHeight = index === 0 ? 0 : sectionTitleHeight; // Account for section title on new page
                        }

                        currentPageContent.experience.push(exp);
                        currentHeight += expHeight;
                    }
                }

                // Process education
                if (validEducation.length > 0) {
                    currentHeight += sectionSpacing;
                    if (currentHeight + sectionTitleHeight > maxPageHeight) {
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                        currentHeight = 0;
                    }
                    currentPageContent.showEducationTitle = true;
                    currentHeight += sectionTitleHeight;

                    for (const [index, edu] of validEducation.entries()) {
                        const eduHtml = `
                            <div class="leading-[1.15rem] text-[16px]">
                                <div class="flex justify-between">
                                    <div><span class="font-bold">${edu.school || ''}</span>${edu.degree ? ` — ${edu.degree}` : ''}</div>
                                    <div>${edu.startDate || ''}${edu.endDate ? ` – ${edu.endDate}` : ''}</div>
                                </div>
                                <div class="mt-1">${edu.description || ''}</div>
                            </div>
                        `;
                        const eduHeight = measureHeight(eduHtml) + (index === validEducation.length - 1 ? 0 : innerSectionSpacing);

                        if (currentHeight + eduHeight > maxPageHeight) {
                            newPages.push({ ...currentPageContent });
                            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                            currentHeight = index === 0 ? 0 : sectionTitleHeight;
                        }

                        currentPageContent.education.push(edu);
                        currentHeight += eduHeight;
                    }
                }

                // Process projects
                if (validProjects.length > 0) {
                    currentHeight += sectionSpacing;
                    if (currentHeight + sectionTitleHeight > maxPageHeight) {
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                        currentHeight = 0;
                    }
                    currentPageContent.showProjectsTitle = true;
                    currentHeight += sectionTitleHeight;

                    for (const [index, proj] of validProjects.entries()) {
                        const projHtml = `
                            <div class="leading-[1.15rem] text-[16px]">
                                <div class="font-bold">${proj.name || ''} ${proj.technologies?.length ? `(${proj.technologies.join(', ')})` : ''}</div>
                                <div class="mt-1">${proj.description || ''}</div>
                            </div>
                        `;
                        const projHeight = measureHeight(projHtml) + (index === validProjects.length - 1 ? 0 : innerSectionSpacing);

                        if (currentHeight + projHeight > maxPageHeight) {
                            newPages.push({ ...currentPageContent });
                            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                            currentHeight = index === 0 ? 0 : sectionTitleHeight;
                        }

                        currentPageContent.projects.push(proj);
                        currentHeight += projHeight;
                    }
                }

                // Process skills
                if (validSkills.length > 0) {
                    currentHeight += sectionSpacing;
                    if (currentHeight + sectionTitleHeight > maxPageHeight) {
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                        currentHeight = 0;
                    }
                    currentPageContent.showSkillsTitle = true;
                    currentHeight += sectionTitleHeight;

                    for (const [index, skill] of validSkills.entries()) {
                        const skillHtml = `<li class="leading-[1.15rem] text-[16px]">${skill.description || ''}</li>`;
                        const skillHeight = measureHeight(skillHtml) + (index === 0 ? 3.2 : 1.6);

                        if (currentHeight + skillHeight > maxPageHeight) {
                            newPages.push({ ...currentPageContent });
                            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [] };
                            currentHeight = index === 0 ? 0 : sectionTitleHeight;
                        }

                        currentPageContent.skills.push(skill);
                        currentHeight += skillHeight;
                    }
                }

                // Add the last page if it has content
                if (currentPageContent.experience.length > 0 || 
                    currentPageContent.education.length > 0 || 
                    currentPageContent.projects.length > 0 || 
                    currentPageContent.skills.length > 0 ||
                    Object.keys(currentPageContent.personalInfo).length > 0) {
                    newPages.push(currentPageContent);
                }

                setPages(newPages.length > 0 ? newPages : [{ personalInfo, experience, education, projects, skills }]);
            } finally {
                document.body.removeChild(measureContainer);
            }
        };

        calculatePages();
    }, [toGenerate, personalInfo, experience, education, projects, skills]);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(pages.length, prev + 1));
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <CvPage 
                toGenerate={toGenerate} 
                personalInfo={pages[currentPage - 1]?.personalInfo || {}} 
                experience={pages[currentPage - 1]?.experience || []} 
                education={pages[currentPage - 1]?.education || []} 
                projects={pages[currentPage - 1]?.projects || []} 
                skills={pages[currentPage - 1]?.skills || []}
                showExperienceTitle={pages[currentPage - 1]?.showExperienceTitle}
                showEducationTitle={pages[currentPage - 1]?.showEducationTitle}
                showProjectsTitle={pages[currentPage - 1]?.showProjectsTitle}
                showSkillsTitle={pages[currentPage - 1]?.showSkillsTitle}
            />
            {!toGenerate && pages.length > 1 && (
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
                        {Array.from({ length: pages.length }, (_, i) => i + 1).map((page) => (
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
                        disabled={currentPage === pages.length}
                        className={`px-3 py-2 rounded-md transition-colors ${
                            currentPage === pages.length 
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

function CvPage({ toGenerate, personalInfo, experience, education, projects, skills, showExperienceTitle, showEducationTitle, showProjectsTitle, showSkillsTitle }: { 
    toGenerate?: boolean, 
    personalInfo: PersonalInfo, 
    experience: Experience[], 
    education: Education[], 
    projects: Project[], 
    skills: Skill[],
    showExperienceTitle?: boolean,
    showEducationTitle?: boolean,
    showProjectsTitle?: boolean,
    showSkillsTitle?: boolean
}) {

    const { name, email, phone, github, jobTitle } = personalInfo;
    
    return (
        <div className={`bg-white leading-[1.15rem] ${toGenerate ? "cv-constraints" : "cv-constraints-web p-8 scale-71 origin-top fixed top-10"}`}>
            <div className={`inner-cv-constraints-web ${toGenerate ? "" : "overflow-hidden"}`}>
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
                {(experience.length > 0 || showExperienceTitle) && (
                    <section>
                        <SectionTitle title={showExperienceTitle || toGenerate ? "Experience" : ""} />
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
                {(education.length > 0 || showEducationTitle) && (
                    <section>
                        <SectionTitle title={showEducationTitle || toGenerate ? "Education" : ""} />
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
                {(projects.length > 0 || showProjectsTitle) && (
                    <section>
                        <SectionTitle title={showProjectsTitle || toGenerate ? "Projects" : ""} />
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
                {(skills.length > 0 || showSkillsTitle) && (
                    <section>
                        <SectionTitle title={showSkillsTitle || toGenerate ? "Skills" : ""} />
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
