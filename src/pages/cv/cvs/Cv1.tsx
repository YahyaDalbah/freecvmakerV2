import type { Education, Experience, PersonalInfo, Project, Skill, Reference } from "../../../apis/types";
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
    references: Reference[];
    showExperienceTitle?: boolean;
    showEducationTitle?: boolean;
    showProjectsTitle?: boolean;
    showSkillsTitle?: boolean;
    showReferencesTitle?: boolean;
};

// Extended type to mark continuation items (show only description, no header)
type ContinuationExperience = Experience & { isContinuation?: boolean };
type ContinuationEducation = Education & { isContinuation?: boolean };
type ContinuationProject = Project & { isContinuation?: boolean };
type ContinuationReference = Reference & { isContinuation?: boolean };

// Generic type for sections that can be split
type SplittableItem = Experience | Education | Project | Reference;
type ContinuationItem = ContinuationExperience | ContinuationEducation | ContinuationProject | ContinuationReference;

// Configuration for rendering different section types
interface SectionConfig<T extends SplittableItem> {
    renderHeader: (item: T) => string;
    renderDescription: (item: T) => string;
    getDescription: (item: T) => string | undefined;
    hasDescription: (item: T) => boolean;
}

// Helper to render markdown to HTML string (simplified - handles common patterns)
function renderMarkdownToHtml(markdown: string): string {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Convert markdown lists to HTML lists
    const lines = html.split('\n');
    let inList = false;
    let result = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        
        if (isListItem) {
            if (!inList) {
                result += '<ul class="list-disc pl-5">';
                inList = true;
            }
            result += `<li class="leading-[1.15rem]">${line.trim().substring(2)}</li>`;
        } else {
            if (inList) {
                result += '</ul>';
                inList = false;
            }
            if (line.trim()) {
                result += `<p class="leading-[1.15rem]">${line}</p>`;
            }
        }
    }
    
    if (inList) {
        result += '</ul>';
    }
    
    return result;
}

// Generic function to process any section with splitting support
function processSection<T extends SplittableItem>(
    items: T[],
    config: SectionConfig<T>,
    currentPageContent: PageContent,
    currentHeight: number,
    maxPageHeight: number,
    sectionTitleHeight: number,
    innerSectionSpacing: number,
    sectionSpacing: number,
    measureHeight: (html: string) => number,
    newPages: PageContent[],
    sectionKey: 'experience' | 'education' | 'projects' | 'references'
): { currentPageContent: PageContent; currentHeight: number; newPages: PageContent[] } {
    
    // Add spacing before section
    currentHeight += sectionSpacing;
    
    // Check if section title fits
    if (currentHeight + sectionTitleHeight > maxPageHeight) {
        // Section title doesn't fit - move to new page
        newPages.push({ ...currentPageContent });
        currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
        currentHeight = 0;
    }
    
    // Set the section title flag
    if (sectionKey === 'experience') currentPageContent.showExperienceTitle = true;
    if (sectionKey === 'education') currentPageContent.showEducationTitle = true;
    if (sectionKey === 'projects') currentPageContent.showProjectsTitle = true;
    if (sectionKey === 'references') currentPageContent.showReferencesTitle = true;
    
    currentHeight += sectionTitleHeight;
    
    // Check if first item's header fits with the title (look-ahead)
    const firstItemHasContent = items.length > 0 && isAnyFieldFilled(items[0]);
    if (firstItemHasContent) {
        const firstItemHeaderHtml = `
            <div class="leading-[1.15rem] text-[16px]">
                ${config.renderHeader(items[0])}
            </div>
        `;
        const firstItemHeaderHeight = measureHeight(firstItemHeaderHtml) + innerSectionSpacing;
        
        // If first item's header doesn't fit with title, move items to next page (keep title on current page)
        if (currentHeight + firstItemHeaderHeight > maxPageHeight) {
            newPages.push({ ...currentPageContent });
            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
            currentHeight = 0;
            // Don't set title flag for next page - title stays on previous page
        }
    }

    // Process each item
    for (const item of items) {
        let remainingItem: T | null = item;
        
        while (remainingItem) {
            // Measure item header only (without description)
            const headerOnlyHtml = `
                <div class="leading-[1.15rem] text-[16px]">
                    ${config.renderHeader(remainingItem)}
                </div>
            `;
            const headerHeight = measureHeight(headerOnlyHtml);
            
            // Measure full item (header + description)
            const description = config.getDescription(remainingItem);
            const renderedDescription = renderMarkdownToHtml(description || '');
            const fullItemHtml = `
                <div class="leading-[1.15rem] text-[16px]">
                    ${config.renderHeader(remainingItem)}
                    ${config.hasDescription(remainingItem) ? `<div class="markdown-content mt-1">${renderedDescription}</div>` : ''}
                </div>
            `;
            const fullItemHeight = measureHeight(fullItemHtml) + innerSectionSpacing;

            
            // Case 1: Full item fits
            if (currentHeight + fullItemHeight <= maxPageHeight) {
                (currentPageContent[sectionKey] as T[]).push(remainingItem);
                currentHeight += fullItemHeight;
                break; // Done with this item
            }
            
            // Case 2: Header fits but description doesn't
            if (currentHeight + headerHeight <= maxPageHeight && config.hasDescription(remainingItem)) {
                
                // Try to split the description
                const baseHtml = `
                    <div class="leading-[1.15rem] text-[16px]">
                        ${config.renderHeader(remainingItem)}
                        <div class="markdown-content mt-1">DESCRIPTION_PLACEHOLDER</div>
                    </div>
                `;
                
                const splitIndex = findDescriptionSplitPoint(
                    baseHtml,
                    config.getDescription(remainingItem)!,
                    maxPageHeight - currentHeight,
                    measureHeight,
                    renderMarkdownToHtml
                );
                
                if (splitIndex !== null) {
                    // Split the description
                    const tokens: string[] = [];
                    const parts = config.getDescription(remainingItem)!.split(/(\n)/);
                    for (const part of parts) {
                        if (part === '\n') {
                            tokens.push(part);
                        } else if (part) {
                            tokens.push(...part.split(' ').filter(t => t));
                        }
                    }
                    
                    const firstPart: string = tokens.slice(0, splitIndex + 1).join(' ').replace(/ \n /g, '\n').replace(/ \n/g, '\n').replace(/\n /g, '\n');
                    const secondPart: string = tokens.slice(splitIndex + 1).join(' ').replace(/ \n /g, '\n').replace(/ \n/g, '\n').replace(/\n /g, '\n');
                    
                    
                    // Add item with first part of description to current page
                    const firstPartItem = { ...remainingItem, description: firstPart } as T;
                    (currentPageContent[sectionKey] as T[]).push(firstPartItem);
                    
                    // Save current page
                    newPages.push({ ...currentPageContent });
                    
                    // Create new page for continuation (only description, no header)
                    currentPageContent = {
                        personalInfo: {},
                        experience: [],
                        education: [],
                        projects: [],
                        skills: [],
                        references: []
                    };
                    
                    const continuationItem = { 
                        ...remainingItem, 
                        description: secondPart,
                        isContinuation: true 
                    } as ContinuationItem as T;
                    
                    (currentPageContent[sectionKey] as T[]).push(continuationItem);
                    currentHeight = measureHeight(`<div class="markdown-content">${renderMarkdownToHtml(secondPart)}</div>`) + innerSectionSpacing;
                    
                    break; // Done with this item
                } else {
                    // Can't split - add header to current page, move description to next
                    
                    // Add item without description to current page
                    const headerOnlyItem = { ...remainingItem, description: '' } as T;
                    (currentPageContent[sectionKey] as T[]).push(headerOnlyItem);
                    
                    // Save current page
                    newPages.push({ ...currentPageContent });
                    
                    // Create new page with only the description
                    currentPageContent = {
                        personalInfo: {},
                        experience: [],
                        education: [],
                        projects: [],
                        skills: [],
                        references: []
                    };
                    
                    const descriptionOnlyItem = { 
                        ...remainingItem,
                        isContinuation: true 
                    } as ContinuationItem as T;
                    
                    (currentPageContent[sectionKey] as T[]).push(descriptionOnlyItem);
                    const descHeight = measureHeight(`<div class="markdown-content">${renderedDescription}</div>`) + innerSectionSpacing;
                    currentHeight = descHeight;
                    
                    break; // Done with this item
                }
            }
            
            // Case 3: Even header doesn't fit - move entire item to next page
            newPages.push({ ...currentPageContent });
            currentPageContent = { personalInfo: {}, experience: [], education: [], projects: [], skills: [], references: [] };
            currentHeight = 0;
            continue; // Try again on fresh page
        }
    }
    
    return { currentPageContent, currentHeight, newPages };
}

// Helper to find the split point in a description where overflow occurs
function findDescriptionSplitPoint(
    baseHtml: string,
    description: string,
    maxHeight: number,
    measureHeight: (html: string) => number,
    renderMarkdownToHtmlFn: (markdown: string) => string
): number | null {
    if (!description) return null;
    
    // Split on BOTH spaces and newlines to handle markdown lists properly
    // This regex splits on spaces while preserving newlines as separate tokens
    const tokens: string[] = [];
    const parts = description.split(/(\n)/); // Split and keep newlines
    
    for (const part of parts) {
        if (part === '\n') {
            tokens.push(part);
        } else if (part) {
            tokens.push(...part.split(' ').filter(t => t));
        }
    }
    
    if (tokens.length <= 1) return null;
    
    // Binary search to find the split point
    let left = 0;
    let right = tokens.length;
    let lastFittingIndex = -1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const testDescription = tokens.slice(0, mid + 1).join(' ').replace(/ \n /g, '\n').replace(/ \n/g, '\n').replace(/\n /g, '\n');
        // Render markdown to HTML for accurate measurement
        const renderedDescription = renderMarkdownToHtmlFn(testDescription);
        const testHtml = baseHtml.replace('DESCRIPTION_PLACEHOLDER', renderedDescription);
        const height = measureHeight(testHtml);
        
        if (height <= maxHeight) {
            lastFittingIndex = mid;
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    // Return the split index (if we found a valid split point)
    return lastFittingIndex > 0 && lastFittingIndex < tokens.length - 1 ? lastFittingIndex : null;
}

export default function Cv1({ toGenerate, personalInfo, experience, education, projects, skills, references }: { toGenerate?: boolean, personalInfo: PersonalInfo, experience: Experience[], education: Education[], projects: Project[], skills: Skill[], references: Reference[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState<PageContent[]>([
        { personalInfo, experience, education, projects, skills, references }
    ]);

    // Calculate pagination based on content overflow by measuring actual rendered heights
    useEffect(() => {
        if (toGenerate) {
            // When generating PDF, show all content on one page
            setPages([{ personalInfo, experience, education, projects, skills, references }]);
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
            if (validExperience.length === 0 && validEducation.length === 0 && 
                validProjects.length === 0 && validSkills.length === 0 && validReferences.length === 0) {
                setPages([{ personalInfo, experience: [], education: [], projects: [], skills: [], references: [] }]);
                return;
            }

            // Create a measurement container with proper styling
            const measureContainer = document.createElement('div');
            measureContainer.style.position = 'absolute';
            measureContainer.style.visibility = 'hidden';
            measureContainer.style.width = '210mm';
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
                const headerHtml = `
                    <div class="text-center mb-4">
                        <h1 class="font-bold tracking-tight text-4xl">${personalInfo.name || ''}</h1>
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

        calculatePages();
        
    }, [toGenerate, personalInfo, experience, education, projects, skills, references]);

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

function CvPage({ toGenerate, personalInfo, experience, education, projects, skills, references, showExperienceTitle, showEducationTitle, showProjectsTitle, showSkillsTitle, showReferencesTitle }: { 
    toGenerate?: boolean, 
    personalInfo: PersonalInfo, 
    experience: Experience[], 
    education: Education[], 
    projects: Project[], 
    skills: Skill[],
    references: Reference[],
    showExperienceTitle?: boolean,
    showEducationTitle?: boolean,
    showProjectsTitle?: boolean,
    showSkillsTitle?: boolean,
    showReferencesTitle?: boolean
}) {

    const { name, email, phone, links, jobTitle } = personalInfo;
    
    return (
        <div className={`bg-white leading-[1.15rem] ${toGenerate ? "cv-constraints" : "cv-constraints-web p-8 scale-71 origin-top fixed top-10"}`}>
            <div className={`inner-cv-constraints-web`}>
            {/* Header */}
            <header className="text-center mb-4">
                <h1 className="font-bold tracking-tight text-4xl">{name}</h1>
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
                                            <div className={`markdown-content ${isContinuation ? '' : 'mt-1'}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{exp.description}</ReactMarkdown>
                                        </div>
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
                                            <div className={`markdown-content ${isContinuation ? '' : 'mt-1'}`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{edu.description}</ReactMarkdown>
                                            </div>
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
                                            <div className={`markdown-content ${isContinuation ? '' : 'mt-1'}`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{proj.description}</ReactMarkdown>
                                            </div>
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
                                            <div className={`markdown-content ${isContinuation ? '' : 'mt-1'}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{ref.description}</ReactMarkdown>
                                        </div>
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
