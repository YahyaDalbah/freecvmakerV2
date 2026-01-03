import DropdownMenu from "../../ui/cv-editing-section/DropdownMenu";
import GridInputsContainer from "../../ui/cv-editing-section/GridInputsContainer";
import SectionTitle from "../../ui/cv-editing-section/SectionTitle";
import TextAreaInput from "../../ui/cv-editing-section/inputs/TextAreaInput";
import TextInput from "../../ui/cv-editing-section/inputs/TextInput";
import type { Education, Experience, Project, Skill, Reference } from "../../apis/types";
import { useState, useCallback, useMemo } from "react";
import Button from "../../ui/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faFileLines } from "@fortawesome/free-solid-svg-icons";
import Cv1 from "./cvs/Cv1";
import { saveAs } from "file-saver";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AutoSaveProvider, useAutoSave } from "../../contexts/AutoSaveContext";
import AutoSaveIndicator from "../../ui/AutoSaveIndicator";

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

function CvPageContent() {
    const [showCvOnSmall, setShowCvOnSmall] = useState(true);
    const isLargeScreen = useMediaQuery('(min-width: 1280px)'); // xl breakpoint
    const [personalInfo, setPersonalInfo] = useState({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1 (555) 123-4567',
        jobTitle: 'Full Stack Developer',
        city: 'New York, USA',
        links: ['https://github.com/johndoe', 'https://linkedin.com/in/johndoe', '']
    });
    
    const [experience, setExperience] = useState<Experience[]>([
        {
            id: '1',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed responsive web applications using React and TypeScript\n- Collaborated with design team to implement UI/UX improvements\n- Optimized application performance, reducing load time by 40%',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        
    ]);
    
    const [education, setEducation] = useState<Education[]>([
        {
            id: '1',
            school: 'MIT',
            degree: 'Bachelor’s Degree',
            fieldOfStudy: 'Computer Science',
            startDate: '2015',
            endDate: '2019',
            description: 'Focused on software engineering, algorithms, and web development.'
        }
    ]);
    
    const [skills, setSkills] = useState<Skill[]>([
        {
            id: '1',
            description: 'JavaScript, TypeScript, React, Next.js'
        },
        {
            id: '2',
            description: 'HTML5, CSS3, Tailwind CSS, Sass'
        },
        {
            id: '3',
            description: 'Node.js, Express, MongoDB'
        },
        {
            id: '4',
            description: 'Git, GitHub, CI/CD'
        }
    ]);
    
    const [projects, setProjects] = useState<Project[]>([
        {
            id: '1',
            name: 'Portfolio Website',
            description: 'Personal portfolio to showcase projects and skills.',
            technologies: ['React', 'Tailwind CSS', 'TypeScript']
        },
        {
            id: '2',
            name: 'E-commerce Store',
            description: '',
            technologies: ['Next.js', 'MongoDB', 'Stripe']
        }
    ]);
    
    const [references, setReferences] = useState<Reference[]>([
        {
            id: '1',
            name: 'Jane Smith',
            company: 'Tech Solutions Inc.',
            email: 'jane.smith@techsolutions.com',
            phone: '+1 (555) 987-6543',
            description: 'Former manager at Tech Solutions Inc.'
        }
    ]);
    

    const updatePersonalInfo = useCallback((field: keyof typeof personalInfo, value: string | string[]) => {
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateLink = useCallback((index: number, value: string) => {
        setPersonalInfo(prev => {
            const newLinks = [...(prev.links || ['', '', ''])];
            newLinks[index] = value;
            return { ...prev, links: newLinks };
        });
    }, []);

    const updateExperience = useCallback((id: string, field: keyof Experience, value: string) => {
        setExperience(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
        setEducation(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const updateSkills = useCallback((id: string, value: string) => {
        setSkills(prev => prev.map(item =>
            item.id === id ? { ...item, description: value } : item
        ));
    }, []);

    const updateProject = useCallback((id: string, field: keyof Project, value: string | string[]) => {
        setProjects(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const updateReference = useCallback((id: string, field: keyof Reference, value: string) => {
        setReferences(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const addExperience = useCallback(() => {
        setExperience(prev => [...prev, { id: generateId(), jobTitle: '', company: '', startDate: '', endDate: '', description: '', city: '', github: '' }]);
    }, []);
    
    const deleteExperience = useCallback((id: string) => {
        setExperience(prev => prev.filter(item => item.id !== id));
    }, []);
    
    const addEducation = useCallback(() => {
        setEducation(prev => [...prev, { id: generateId(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }]);
    }, []);
    
    const deleteEducation = useCallback((id: string) => {
        setEducation(prev => prev.filter(item => item.id !== id));
    }, []);
    
    const addSkill = useCallback(() => {
        setSkills(prev => [...prev, { id: generateId(), description: '' }]);
    }, []);
    
    const deleteSkill = useCallback((id: string) => {
        setSkills(prev => prev.filter(item => item.id !== id));
    }, []);
    
    const addProject = useCallback(() => {
        setProjects(prev => [...prev, { id: generateId(), name: '', description: '', technologies: [] }]);
    }, []);
    
    const deleteProject = useCallback((id: string) => {
        setProjects(prev => prev.filter(item => item.id !== id));
    }, []);
    
    const addReference = useCallback(() => {
        setReferences(prev => [...prev, { id: generateId(), name: '', company: '', email: '', phone: '', description: '' }]);
    }, []);
    
    const deleteReference = useCallback((id: string) => {
        setReferences(prev => prev.filter(item => item.id !== id));
    }, []);
    
    // Memoize CV props to prevent unnecessary re-renders
    const cvProps = useMemo(() => ({
        personalInfo,
        experience,
        education,
        projects,
        skills,
        references
    }), [personalInfo, experience, education, projects, skills, references]);

    async function handleGeneratePdf() {
        const payload = {
            personalInfo,
            experience,
            education,
            projects,
            skills,
            references,
        };
        const res = await fetch("http://localhost:3001/api/generate-cv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok){
            alert("Error generating PDF");
            return;
        }
        const blob = await res.blob();
        // @ts-ignore - file-saver type can be missing
        saveAs(blob, "cv.pdf");
    }
    return (
        <div className="relative grid grid-cols-1 xl:grid-cols-2">
            <div className={`${showCvOnSmall ? 'hidden' : 'flex'} xl:flex flex-col gap-12 p-12`}>
                {/* Personal Info */}
                <div>
                    <SectionTitle title="Personal Info" />
                    <GridInputsContainer>
                        <TextInput label="Name" name="name" type="text" placeholder="Enter your name" value={personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
                        <TextInput label="Email" name="email" type="email" placeholder="Enter your email" value={personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                        <TextInput label="Phone" name="phone" type="tel" placeholder="Enter your phone" value={personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                        <TextInput label="Job Title" name="jobTitle" type="text" placeholder="Enter your job title" value={personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} />
                        <TextInput label="City" name="city" type="text" placeholder="Enter your city" value={personalInfo.city} onChange={(e) => updatePersonalInfo('city', e.target.value)} />
                        <TextInput label="Link 1 (Github, Linkedin, Portfolio, ...)" name="link1" type="text" placeholder="Enter your url" value={personalInfo.links?.[0] || ''} onChange={(e) => updateLink(0, e.target.value)} />
                        <TextInput label="Link 2 (Github, Linkedin, Portfolio, ...)" name="link2" type="text" placeholder="Enter your url" value={personalInfo.links?.[1] || ''} onChange={(e) => updateLink(1, e.target.value)} />
                        <TextInput label="Link 3 (Github, Linkedin, Portfolio, ...)" name="link3" type="text" placeholder="Enter your url" value={personalInfo.links?.[2] || ''} onChange={(e) => updateLink(2, e.target.value)} />
                    </GridInputsContainer>
                </div>
                {/* Experience */}
                <div>
                    <SectionTitle title="Experience" />
                    <div className="flex flex-col gap-4">
                        {experience.map((experience) => (
                            <DropdownMenu title={experience.jobTitle} onDelete={() => deleteExperience(experience.id)} key={experience.id}>
                                <GridInputsContainer>
                                    <TextInput label="Job Title" name="jobTitle" type="text" placeholder="Enter job title" value={experience.jobTitle} onChange={(e) => updateExperience(experience.id, 'jobTitle', e.target.value)} />
                                    <TextInput label="Company" name="company" type="text" placeholder="Enter company" value={experience.company} onChange={(e) => updateExperience(experience.id, 'company', e.target.value)} />
                                    <div className="date-input">
                                        <TextInput label="Start & End Date" name="startDate" type="text" placeholder="Enter start date" value={experience.startDate} onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)} />
                                        <TextInput name="endDate" type="text" placeholder="Enter end date" value={experience.endDate} onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)} />
                                    </div>
                                    <TextInput label="City" name="city" type="text" placeholder="Enter city" value={experience.city} onChange={(e) => updateExperience(experience.id, 'city', e.target.value)} />
                                    <TextAreaInput span={true} label="Description" name="description" value={experience.description} onChange={(value) => updateExperience(experience.id, 'description', value)} />
                                </GridInputsContainer>
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addExperience}><FontAwesomeIcon icon={faPlus} /> Add Experience</Button>
                    </div>
                </div>
                {/* Education */}
                <div>
                    <SectionTitle title="Education" />
                    <div className="flex flex-col gap-4">
                        {education.map((education) => (
                            <DropdownMenu title={education.school && education.degree ? education.school + ' - ' + education.degree : '(Untitled)'} onDelete={() => deleteEducation(education.id)} key={education.id}>
                                <GridInputsContainer>
                                    <TextInput label="School" name="school" type="text" placeholder="Enter school" value={education.school} onChange={(e) => updateEducation(education.id, 'school', e.target.value)} />
                                    <TextInput label="Degree" name="degree" type="text" placeholder="Enter degree" value={education.degree} onChange={(e) => updateEducation(education.id, 'degree', e.target.value)} />
                                    <div className="date-input">
                                        <TextInput label="Start & End Date" name="startDate" type="text" placeholder="Enter start date" value={education.startDate} onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)} />
                                        <TextInput name="endDate" type="text" placeholder="Enter end date" value={education.endDate} onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)} />
                                    </div>
                                    <TextInput label="Field of Study" name="fieldOfStudy" type="text" placeholder="Enter field of study" value={education.fieldOfStudy} onChange={(e) => updateEducation(education.id, 'fieldOfStudy', e.target.value)} />
                                    <TextAreaInput span={true} label="Description" name="description" value={education.description} onChange={(value) => updateEducation(education.id, 'description', value)} />
                                </GridInputsContainer>
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addEducation}><FontAwesomeIcon icon={faPlus} /> Add Education</Button>
                    </div>
                </div>
                {/* Projects */}
                <div>
                    <SectionTitle title="Projects" />
                    <div className="flex flex-col gap-4">
                        {projects.map((project) => (
                            <DropdownMenu title={project.name} onDelete={() => deleteProject(project.id)} key={project.id}>
                                <GridInputsContainer>
                                    <TextInput label="Project" name="project" type="text" placeholder="Enter project" value={project.name} onChange={(e) => updateProject(project.id, 'name', e.target.value)} />
                                    <TextInput label="Technologies" name="technologies" type="text" placeholder="Enter technologies" value={project.technologies?.join(', ')} onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech))} />
                                    <TextAreaInput span={true} label="Description" name="description" value={project.description} onChange={(value) => updateProject(project.id, 'description', value)} />
                                </GridInputsContainer>
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addProject}><FontAwesomeIcon icon={faPlus} /> Add Project</Button>
                    </div>
                </div>
                {/* Skills */}
                <div>
                    <SectionTitle title="Skills" />
                    <div className="flex flex-col gap-4">
                        {skills.map((skill) => (
                            <DropdownMenu title={skill.description} onDelete={() => deleteSkill(skill.id)} key={skill.id}>
                                <GridInputsContainer>
                                    <TextInput name="skillsDescription" label="Skills" type="text" placeholder="Enter related skills" value={skill.description} onChange={(e) => updateSkills(skill.id, e.target.value)} />
                                </GridInputsContainer>
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addSkill}><FontAwesomeIcon icon={faPlus} /> Add Skill</Button>
                    </div>
                </div>
                {/* References */}
                <div>
                    <SectionTitle title="References" />
                    <div className="flex flex-col gap-4">
                        {references.map((reference) => (
                            <DropdownMenu title={reference.name} onDelete={() => deleteReference(reference.id)} key={reference.id}>
                                <GridInputsContainer>
                                    <TextInput label="Name" name="name" type="text" placeholder="Enter name" value={reference.name} onChange={(e) => updateReference(reference.id, 'name', e.target.value)} />
                                    <TextInput label="Company" name="company" type="text" placeholder="Enter company" value={reference.company} onChange={(e) => updateReference(reference.id, 'company', e.target.value)} />
                                    <TextInput label="Email" name="email" type="email" placeholder="Enter email" value={reference.email} onChange={(e) => updateReference(reference.id, 'email', e.target.value)} />
                                    <TextInput label="Phone" name="phone" type="tel" placeholder="Enter phone" value={reference.phone} onChange={(e) => updateReference(reference.id, 'phone', e.target.value)} />
                                    <TextAreaInput span={true} label="Description" name="description" value={reference.description} onChange={(value) => updateReference(reference.id, 'description', value)} />
                                </GridInputsContainer>
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addReference}><FontAwesomeIcon icon={faPlus} /> Add Reference</Button>
                    </div>
                </div>
            </div>
            <div className={`bg-gray-700 ${showCvOnSmall ? 'flex' : 'hidden'} w-dvw h-dvh xl:w-auto xl:h-auto xl:flex flex-col items-center`}>
                <div className="fixed top-2 right-4 z-10">
                    <Button variant="solid" color="blue" onClick={handleGeneratePdf} shadow={false}>
                        Generate PDF
                    </Button>
                </div>
                {/* Only render CV when visible (on large screens or when showCvOnSmall is true) */}
                {(isLargeScreen || showCvOnSmall) && <Cv1 {...cvProps} />}
            </div>
            <button onClick={() => setShowCvOnSmall(prev => !prev)} className="xl:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center z-50 cursor-pointer" aria-label={showCvOnSmall ? 'Open editor' : 'Open CV preview'}>
                <FontAwesomeIcon icon={showCvOnSmall ? faPenToSquare : faFileLines} />
            </button>
            <AutoSaveIndicator status={useAutoSave().status} />
        </div>
    )
}

export default function CvPage() {
    return (
        <AutoSaveProvider>
            <CvPageContent />
        </AutoSaveProvider>
    );
}
