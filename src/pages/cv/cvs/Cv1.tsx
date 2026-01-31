import type { Education, Experience, PersonalInfo, Project, Skill, Reference } from "../../../apis/types";
import SectionTitle from "../../../ui/cv-sections/SectionTitle";
import SectionListContainer from "../../../ui/cv-sections/SectionListContainer";
import MarkdownRender from "../../../ui/cv-sections/MarkdownRender";
import { useEffect, useState, memo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { 
    isAnyFieldFilled, 
    processSection, 
    renderMarkdownToHtml,
    type PageContent,
    type ContinuationExperience,
    type ContinuationEducation,
    type ContinuationProject,
    type ContinuationReference,
    type SectionConfig
} from "../../../utils/cv.utils";

function Cv1({ toGenerate, personalInfo, professionalSummary, experience, education, projects, skills, references }: { toGenerate?: boolean, personalInfo: PersonalInfo, professionalSummary?: string, experience: Experience[], education: Education[], projects: Project[], skills: Skill[], references: Reference[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState<PageContent[]>([
        { personalInfo, professionalSummary, experience, education, projects, skills, references }
    ]);
    const isInitialLoad = useRef(true);

    // Calculate pagination based on content overflow by measuring actual rendered heights
    useEffect(() => {
        if (toGenerate) {
            // When generating PDF, show all content on one page
            setPages([{ personalInfo, professionalSummary, experience, education, projects, skills, references }]);
            return;
        }

        const calculatePages = async () => {
            // Filter out empty items
            const validExperience = experience.filter(isAnyFieldFilled);
            const validEducation = education.filter(isAnyFieldFilled);
            const validProjects = projects.filter(isAnyFieldFilled);
            const validSkills = skills.filter(isAnyFieldFilled);
            const validReferences = references.filter(isAnyFieldFilled);

            // If no content, show single empty page
            if (!professionalSummary?.trim() && validExperience.length === 0 && validEducation.length === 0 && 
                validProjects.length === 0 && validSkills.length === 0 && validReferences.length === 0) {
                setPages([{ personalInfo, experience: [], education: [], projects: [], skills: [], references: [] }]);
                return;
            }

            // Create a measurement container with proper styling
            const measureContainer = document.createElement('div');
            measureContainer.style.position = 'absolute';
            measureContainer.style.visibility = 'hidden';
            measureContainer.style.width = '240mm';
            measureContainer.style.left = '-9999px';
            measureContainer.className = 'leading-[1.15rem] text-[16px]'; // Match CV styling
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
                const sectionTitleHeight = 27.4; // Approximate height for section title

                let newPages: PageContent[] = [];
                let currentHeight = 0;
                let currentPageContent: PageContent = {
                    personalInfo: {},
                    experience: [],
                    education: [],
                    projects: [],
                    skills: [],
                    references: []
                };

                // Measure and add header (only on first page)
                const linksHtml = (personalInfo.links || []).filter(link => link?.trim()).map((link, index) => 
                    `${index > 0 ? '<span> | </span>' : ''}<a class="text-blue-600 underline" href="${link}">${link}</a>`
                ).join('');
                const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
                const headerHtml = `
                    <div class="text-center mb-4">
                        <h1 class="font-bold tracking-tight text-4xl">${fullName || ''}</h1>
                        <p class="text-gray-600 font-bold text-xl">${personalInfo.jobTitle || ''}</p>
                        <div class="text-[16px]">${personalInfo.phone || ''}</div>
                        <div class="text-[16px]">${linksHtml}</div>
                    </div>
                `;
                const headerHeight = measureHeight(headerHtml);
                currentPageContent.personalInfo = personalInfo;
                currentHeight = headerHeight;

                // Section configurations
                const experienceConfig: SectionConfig<Experience> = {
                    renderHeader: (exp) => `
                        <div class="flex justify-between">
                            <div><span class="font-bold">${exp.jobTitle || ''}</span>${exp.company ? ` | ${exp.company}` : ''}</div>
                            <div>${exp.startDate || ''}${exp.endDate ? ` – ${exp.endDate}` : ''}</div>
                        </div>
                        <div class="mt-0.5">${exp.city || ''}</div>
                    `,
                    renderDescription: (exp) => renderMarkdownToHtml(exp.description || ''),
                    getDescription: (exp) => exp.description,
                    hasDescription: (exp) => !!exp.description && exp.description.trim().length > 0
                };

                const educationConfig: SectionConfig<Education> = {
                    renderHeader: (edu) => `
                        <div class="flex justify-between">
                            <div><span class="font-bold">${edu.school || ''}</span>${edu.degree ? ` — ${edu.degree}` : ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                            <div>${edu.startDate || ''}${edu.endDate ? ` – ${edu.endDate}` : ''}</div>
                        </div>
                    `,
                    renderDescription: (edu) => renderMarkdownToHtml(edu.description || ''),
                    getDescription: (edu) => edu.description,
                    hasDescription: (edu) => !!edu.description && edu.description.trim().length > 0
                };

                const projectConfig: SectionConfig<Project> = {
                    renderHeader: (proj) => `
                        <div class="font-bold">${proj.name || ''} ${proj.technologies?.length ? `(${proj.technologies.join(', ')})` : ''}</div>
                    `,
                    renderDescription: (proj) => renderMarkdownToHtml(proj.description || ''),
                    getDescription: (proj) => proj.description,
                    hasDescription: (proj) => !!proj.description && proj.description.trim().length > 0
                };

                const referenceConfig: SectionConfig<Reference> = {
                    renderHeader: (ref) => `
                        <div class="flex justify-between">
                            <div><span class="font-bold">${ref.name || ''}</span>${ref.company ? ` | ${ref.company}` : ''}</div>
                        </div>
                        <div class="mt-0.5">${ref.email || ''} ${ref.phone ? ` | ${ref.phone}` : ''}</div>
                    `,
                    renderDescription: (ref) => renderMarkdownToHtml(ref.description || ''),
                    getDescription: (ref) => ref.description,
                    hasDescription: (ref) => !!ref.description && ref.description.trim().length > 0
                };

                // Process Professional Summary (if exists)
                if (professionalSummary && professionalSummary.trim()) {
                    // Add spacing before section
                    currentHeight += sectionSpacing;
                    
                    // Check if section title fits
                    if (currentHeight + sectionTitleHeight > maxPageHeight) {
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
                        currentHeight = 0;
                    }
                    
                    // Set section title flag
                    currentPageContent.showProfessionalSummaryTitle = true;
                    currentPageContent.professionalSummary = professionalSummary;
                    currentHeight += sectionTitleHeight;
                    
                    // Measure and add summary content
                    const summaryHtml = `<div>${renderMarkdownToHtml(professionalSummary)}</div>`;
                    const summaryHeight = measureHeight(summaryHtml);
                    
                    // Check if summary fits with the title
                    if (currentHeight + summaryHeight > maxPageHeight) {
                        // Title fits but summary doesn't - move to next page
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, professionalSummary, experience: [], education: [], projects: [], skills: [], references: [] };
                        currentHeight = summaryHeight;
                    } else {
                        currentHeight += summaryHeight;
                    }
                }

                // Process all sections using generic function
                if (validExperience.length > 0) {
                    const result = processSection(
                        validExperience,
                        experienceConfig,
                        currentPageContent,
                        currentHeight,
                        maxPageHeight,
                        sectionTitleHeight,
                        innerSectionSpacing,
                        sectionSpacing,
                        measureHeight,
                        newPages,
                        'experience'
                    );
                    currentPageContent = result.currentPageContent;
                    currentHeight = result.currentHeight;
                    newPages = result.newPages;
                }

                if (validEducation.length > 0) {
                    const result = processSection(
                        validEducation,
                        educationConfig,
                        currentPageContent,
                        currentHeight,
                        maxPageHeight,
                        sectionTitleHeight,
                        innerSectionSpacing,
                        sectionSpacing,
                        measureHeight,
                        newPages,
                        'education'
                    );
                    currentPageContent = result.currentPageContent;
                    currentHeight = result.currentHeight;
                    newPages = result.newPages;
                }

                if (validProjects.length > 0) {
                    const result = processSection(
                        validProjects,
                        projectConfig,
                        currentPageContent,
                        currentHeight,
                        maxPageHeight,
                        sectionTitleHeight,
                        innerSectionSpacing,
                        sectionSpacing,
                        measureHeight,
                        newPages,
                        'projects'
                    );
                    currentPageContent = result.currentPageContent;
                    currentHeight = result.currentHeight;
                    newPages = result.newPages;
                }

                // Process skills (special case - no splitting needed for simple list items)
                if (validSkills.length > 0) {
                    // Add spacing before section
                    currentHeight += sectionSpacing;
                    
                    // Check if section title fits
                    if (currentHeight + sectionTitleHeight > maxPageHeight) {
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
                        currentHeight = 0;
                    }
                    
                    // Set section title flag
                    currentPageContent.showSkillsTitle = true;
                    currentHeight += sectionTitleHeight;
                    
                    // Check if first skill fits with the title (look-ahead)
                    const firstSkillHtml = `<ul class="list-disc pl-5"><li>${validSkills[0].description || ''}</li></ul>`;
                    const firstSkillHeight = measureHeight(firstSkillHtml) + 3.2; // First skill has more spacing
                    
                    if (currentHeight + firstSkillHeight > maxPageHeight) {
                        // Title fits but first skill doesn't - keep title, move skills to next page
                        newPages.push({ ...currentPageContent });
                        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
                        currentHeight = 0;
                        // Don't set title flag - title stays on previous page
                    }

                    // Process each skill
                    for (const [index, skill] of validSkills.entries()) {
                        const skillHtml = `<ul class="list-disc pl-5"><li class="leading-[1.15rem] text-[16px]">${skill.description || ''}</li></ul>`;
                        const skillHeight = measureHeight(skillHtml) - 3.6 + (index === 0 ? 3.2 : 1.6);
                        console.log(measureHeight(skillHtml), measureHeight(skillHtml) - 3.6);


                        if (currentHeight + skillHeight > maxPageHeight) {
                            // Skill doesn't fit - move to next page
                            newPages.push({ ...currentPageContent });
                            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
                            currentHeight = 0; // No title on continuation pages
                        }

                        currentPageContent.skills.push(skill);
                        currentHeight += skillHeight;
                    }
                }

                // Process references (similar to experience)
                if (validReferences.length > 0) {
                    const result = processSection(
                        validReferences,
                        referenceConfig,
                        currentPageContent,
                        currentHeight,
                        maxPageHeight,
                        sectionTitleHeight,
                        innerSectionSpacing,
                        sectionSpacing,
                        measureHeight,
                        newPages,
                        'references'
                    );
                    currentPageContent = result.currentPageContent;
                    currentHeight = result.currentHeight;
                    newPages = result.newPages;
                }

                // Add the last page if it has content
                if (currentPageContent.experience.length > 0 ||
                    currentPageContent.education.length > 0 ||
                    currentPageContent.projects.length > 0 ||
                    currentPageContent.skills.length > 0 ||
                    currentPageContent.references.length > 0 ||
                    Object.keys(currentPageContent.personalInfo).length > 0) {
                    newPages.push(currentPageContent);
                }

                setPages(newPages.length > 0 ? newPages : [{ personalInfo, experience, education, projects, skills, references }]);
            } finally {
                document.body.removeChild(measureContainer);
            }
        };

        // Run immediately on initial load, debounce on subsequent updates
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            calculatePages();
            return;
        }

        // Debounce the expensive calculation for subsequent updates
        const timeoutId = setTimeout(() => {
            calculatePages();
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [toGenerate, personalInfo, professionalSummary, experience, education, projects, skills, references]);

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
                references={pages[currentPage - 1]?.references || []}
                professionalSummary={pages[currentPage - 1]?.professionalSummary}
                showProfessionalSummaryTitle={pages[currentPage - 1]?.showProfessionalSummaryTitle}
                showExperienceTitle={pages[currentPage - 1]?.showExperienceTitle}
                showEducationTitle={pages[currentPage - 1]?.showEducationTitle}
                showProjectsTitle={pages[currentPage - 1]?.showProjectsTitle}
                showSkillsTitle={pages[currentPage - 1]?.showSkillsTitle}
                showReferencesTitle={pages[currentPage - 1]?.showReferencesTitle}
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

function CvPage({ toGenerate, personalInfo, professionalSummary, experience, education, projects, skills, references, showProfessionalSummaryTitle, showExperienceTitle, showEducationTitle, showProjectsTitle, showSkillsTitle, showReferencesTitle }: { 
    toGenerate?: boolean, 
    personalInfo: PersonalInfo,
    professionalSummary?: string,
    experience: Experience[], 
    education: Education[], 
    projects: Project[], 
    skills: Skill[],
    references: Reference[],
    showProfessionalSummaryTitle?: boolean,
    showExperienceTitle?: boolean,
    showEducationTitle?: boolean,
    showProjectsTitle?: boolean,
    showSkillsTitle?: boolean,
    showReferencesTitle?: boolean
}) {

    const { firstName, lastName, email, phone, links, jobTitle } = personalInfo;
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    
    return (
        <div className={`bg-white leading-[1.15rem] ${toGenerate ? "cv-constraints" : "cv-constraints-web p-8 scale-66 2xl:scale-67 origin-bottom fixed bottom-14"}`}>
            <div className={`inner-cv-constraints-web`}>
            {/* Header */}
            <header className="text-center mb-4">
                <h1 className="font-bold tracking-tight text-4xl">{fullName}</h1>
                <p className="text-gray-600 font-bold text-xl">{jobTitle}</p>
                <div className="text-[16px]">
                    <span>{phone}</span>
                    {email && (
                        <>
                            {(phone && email) && <span> | </span>}
                            <a className="text-blue-600 underline" href={`mailto:${email}`}>
                                {email}
                            </a>
                        </>
                    )}
                </div>
                <div className="text-[16px]">
                    {links?.filter(link => link?.trim()).map((link, index) => (
                        <span key={index}>
                            {index > 0 && <span> | </span>}
                            <a className="text-blue-600 underline" href={link} target="_blank" rel="noopener noreferrer">
                                {link}
                            </a>
                        </span>
                    ))}
                </div>
            </header>

            {/* Sections */}
            <div className="text-[16px] space-y-5">

                {/* Professional Summary */}
                {(professionalSummary || showProfessionalSummaryTitle) && (
                    <section>
                        <SectionTitle title={showProfessionalSummaryTitle || toGenerate ? "Professional Summary" : ""} />
                        {professionalSummary && (
                            <MarkdownRender content={professionalSummary} />
                        )}
                    </section>
                )}

                {/* Experience */}
                {(experience.length > 0 || showExperienceTitle) && (
                    <section>
                        <SectionTitle title={showExperienceTitle || toGenerate ? "Experience" : ""} />
                        <SectionListContainer>
                            {experience.map((exp) => {
                                const isContinuation = (exp as ContinuationExperience).isContinuation;
                                return isAnyFieldFilled(exp) && (
                                <div key={exp.id}>
                                        {/* Only show header if NOT a continuation */}
                                        {!isContinuation && (
                                            <>
                                                <div className="flex justify-between">
                                                    <div>
                                                        <span className="font-bold">{exp.jobTitle}</span>
                                                        {exp.company && <span> | {exp.company}</span>}
                                                    </div>
                                                    <div className="whitespace-nowrap">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}</div>
                                                </div>
                                                <div className="mt-0.5">{exp.city}</div>
                                            </>
                                        )}
                                        {/* Always show description */}
                                    {exp.description && (
                                        <MarkdownRender content={exp.description} className={isContinuation ? '' : 'mt-1'} />
                                    )}
                                </div>
                                );
                            })}
                        </SectionListContainer>
                    </section>
                )}
                
                {/* Education */}
                {(education.length > 0 || showEducationTitle) && (
                    <section>
                        <SectionTitle title={showEducationTitle || toGenerate ? "Education" : ""} />
                        <SectionListContainer>
                            {education.map((edu) => {
                                const isContinuation = (edu as ContinuationEducation).isContinuation;
                                return isAnyFieldFilled(edu) && (
                                    <div key={edu.id}>
                                        {/* Only show header if NOT a continuation */}
                                        {!isContinuation && (
                                            <div className="flex justify-between">
                                                <div>
                                                    <span className="font-bold">{edu.school}</span>
                                                    {edu.degree && <span> — {edu.degree}</span>}
                                                    {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                                                </div>
                                                <div >{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
                                            </div>
                                        )}
                                        {/* Always show description */}
                                        {edu.description && (
                                            <MarkdownRender content={edu.description} className={isContinuation ? '' : 'mt-1'} />
                                        )}
                                    </div>
                                );
                            })}
                        </SectionListContainer>
                    </section>
                )}

                {/* Projects */}
                {(projects.length > 0 || showProjectsTitle) && (
                    <section>
                        <SectionTitle title={showProjectsTitle || toGenerate ? "Projects" : ""} />
                        <SectionListContainer>
                            {projects.map((proj) => {
                                const isContinuation = (proj as ContinuationProject).isContinuation;
                                return isAnyFieldFilled(proj) && (
                                    <div key={proj.id}>
                                        {/* Only show header if NOT a continuation */}
                                        {!isContinuation && (
                                            <div className="font-bold">{`${proj.name} ${proj.technologies && proj.technologies.length > 0 ? `(${proj.technologies.join(", ")})` : ""}`}</div>
                                        )}
                                        {/* Always show description */}
                                        {proj.description && (
                                            <MarkdownRender content={proj.description} className={isContinuation ? '' : 'mt-1'} />
                                        )}
                                    </div>
                                );
                            })}
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

                {/* References */}
                {(references.length > 0 || showReferencesTitle) && (
                    <section>
                        <SectionTitle title={showReferencesTitle || toGenerate ? "References" : ""} />
                        <SectionListContainer>
                            {references.map((ref) => {
                                const isContinuation = (ref as ContinuationReference).isContinuation;
                                return isAnyFieldFilled(ref) && (
                                <div key={ref.id}>
                                        {/* Only show header if NOT a continuation */}
                                        {!isContinuation && (
                                            <>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{ref.name}</span>
                                            {ref.company && <span> | {ref.company}</span>}
                                        </div>
                                    </div>
                                    <div className="mt-0.5"><a className="text-blue-600 underline" href={`mailto:${ref.email}`}>{ref.email}</a> {ref.phone ? ` | ${ref.phone}` : ''}</div>
                                            </>
                                        )}
                                        {/* Always show description */}
                                    {ref.description && (
                                        <MarkdownRender content={ref.description} className={isContinuation ? '' : 'mt-1'} />
                                    )}
                                </div>
                                );
                            })}
                        </SectionListContainer>
                    </section>
                )}
            </div>
            </div>
        </div>

    );
}

export default memo(Cv1);
