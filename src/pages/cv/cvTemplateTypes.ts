import type { Education, Experience, PersonalInfo, Project, Reference, Skill } from "../../apis/types";
import type { CvSectionId } from "../../apis/cvApi";

/** Props every CV template must accept — same shape POSTed to /api/generate-cv and stored for /print. */
export type CvTemplateProps = {
    variant?: "print" | "embedded";
    color?: string;
    personalInfo: PersonalInfo;
    professionalSummary?: string;
    sectionOrder?: CvSectionId[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: Skill[];
    references: Reference[];
};
