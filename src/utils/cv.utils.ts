import type { Education, Experience, Project, Reference } from "../apis/types";

export function isAnyFieldFilled(section: any): boolean {
    return Object.keys(section).some(key => {
        if (key === 'id') return false;
        const value = section[key];
        if (value === undefined || value === null) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.some(v => typeof v === 'string' && v.trim() !== '');
        return false;
    });
}

export type PageContent = {
    personalInfo: any;
    professionalSummary?: string;
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: any[];
    references: Reference[];
    showProfessionalSummaryTitle?: boolean;
    showExperienceTitle?: boolean;
    showEducationTitle?: boolean;
    showProjectsTitle?: boolean;
    showSkillsTitle?: boolean;
    showReferencesTitle?: boolean;
};

// Extended type to mark continuation items (show only description, no header)
export type ContinuationExperience = Experience & { isContinuation?: boolean };
export type ContinuationEducation = Education & { isContinuation?: boolean };
export type ContinuationProject = Project & { isContinuation?: boolean };
export type ContinuationReference = Reference & { isContinuation?: boolean };

// Generic type for sections that can be split
export type SplittableItem = Experience | Education | Project | Reference;
export type ContinuationItem = ContinuationExperience | ContinuationEducation | ContinuationProject | ContinuationReference;

// Configuration for rendering different section types
export interface SectionConfig<T extends SplittableItem> {
    renderHeader: (item: T) => string;
    renderDescription: (item: T) => string;
    getDescription: (item: T) => string | undefined;
    hasDescription: (item: T) => boolean;
}

// Helper to render markdown to HTML string (matches MarkdownRender.tsx behavior)
// Each line is rendered separately with proper line breaks
export function renderMarkdownToHtml(markdown: string): string {
    if (!markdown) return '';
    
    const lines = markdown.split('\n');
    let result = '';
    
    // Wrap in a container that matches MarkdownRender styling
    result += '<div class="[&_p]:m-0 [&_p]:inline">';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Each line is wrapped in a block span, matching MarkdownRender.tsx
        result += '<span class="block">';
        
        // Simple markdown processing for each line
        let processedLine = line;
        
        // Handle bold **text** or __text__
        processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        processedLine = processedLine.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Handle italic *text* or _text_
        processedLine = processedLine.replace(/\*(.+?)\*/g, '<em>$1</em>');
        processedLine = processedLine.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Handle links [text](url)
        processedLine = processedLine.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>');
        
        // Handle list items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            processedLine = '<ul class="list-disc pl-5"><li>' + processedLine.trim().substring(2) + '</li></ul>';
        } else if (line.trim()) {
            // Wrap non-empty lines in inline paragraph
            processedLine = '<p class="inline">' + processedLine + '</p>';
        }
        
        result += processedLine;
        result += '</span>';
    }
    
    result += '</div>';
    
    return result;
}

// Generic function to process any section with splitting support
export function processSection<T extends SplittableItem>(
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
export function findDescriptionSplitPoint(
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
