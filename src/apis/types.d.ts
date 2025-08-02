export type Experience = {
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    city: string;   
    github: string;
}
export type Education = {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
}
export type Project = {
    id: string;
    name: string;
    description: string;
    technologies: string[];
}
export type Technology = {
    id: string;
    technology: string;
}