import DropdownMenu from "../../ui/DropdownMenu";
import GridInputsContainer from "../../ui/GridInputsContainer";
import SectionTitle from "../../ui/SectionTitle";
import TextAreaInput from "../../ui/inputs/TextAreaInput";
import TextInput from "../../ui/inputs/TextInput";
import type { Education, Experience, Project, Technology } from "../../apis/types";
import { useState } from "react";
import Button from "../../ui/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Cv1 from "./cvs/Cv1";
import { saveAs } from "file-saver";

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function CvPage() {
    const [personalInfo, setPersonalInfo] = useState({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1 (555) 123-4567',
        jobTitle: 'Full Stack Developer',
        city: 'New York, USA',
        github: 'https://github.com/johndoe'
    });
    
    const [experience, setExperience] = useState<Experience[]>([
        {
            id: '1',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '2',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '3',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '4',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '5',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '4',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '6',
            jobTitle: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Developed and maintained web applications using React, Redux, and TypeScript.\n- Implemented responsive design and optimized performance for better user experience.',
            city: 'New York, USA',
            github: 'https://github.com/johndoe/frontend-projects'
        },
        {
            id: '7',
            jobTitle: 'Junior Developer',
            company: 'WebWorks',
            startDate: 'Jun 2019',
            endDate: 'Dec 2020',
            description: 'Worked on various client projects using JavaScript, HTML, and CSS.',
            city: 'Boston, USA',
            github: 'https://github.com/johndoe/junior-projects'
        }
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
    
    const [technologies, setTechnologies] = useState<Technology[]>([
        { id: '1', technology: 'React' },
        { id: '2', technology: 'TypeScript' },
        { id: '3', technology: 'Node.js' },
        { id: '4', technology: 'GraphQL' }
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
            description: 'Full-featured online store with product search, cart, and payment system.',
            technologies: ['Next.js', 'MongoDB', 'Stripe']
        }
    ]);
    
    const [programmingLanguages, setProgrammingLanguages] = useState<Technology[]>([
        { id: '1', technology: 'JavaScript' },
        { id: '2', technology: 'TypeScript' },
        { id: '3', technology: 'Python' },
        { id: '4', technology: 'C++' }
    ]);

    const updatePersonalInfo = (field: keyof typeof personalInfo, value: string) => {
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setExperience(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setEducation(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const updateTechnology = (id: string, value: string) => {
        setTechnologies(prev => prev.map(item =>
            item.id === id ? { ...item, technology: value } : item
        ));
    };

    const updateProgrammingLanguage = (id: string, value: string) => {
        setProgrammingLanguages(prev => prev.map(item =>
            item.id === id ? { ...item, technology: value } : item
        ));
    };

    const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
        setProjects(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    function addExperience() {
        setExperience([...experience, { id: generateId(), jobTitle: '', company: '', startDate: '', endDate: '', description: '', city: '', github: '' }]);
    }
    function deleteExperience(id: string) {
        setExperience(experience.filter(item => item.id !== id));
    }
    function addEducation() {
        setEducation([...education, { id: generateId(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }]);
    }
    function deleteEducation(id: string) {
        setEducation(education.filter(item => item.id !== id));
    }
    function addTechnology() {
        setTechnologies([...technologies, { id: generateId(), technology: '' }]);
    }
    function deleteTechnology(id: string) {
        setTechnologies(technologies.filter(item => item.id !== id));
    }
    function addProject() {
        setProjects([...projects, { id: generateId(), name: '', description: '', technologies: [] }]);
    }
    function deleteProject(id: string) {
        setProjects(projects.filter(item => item.id !== id));
    }
    function addProgrammingLanguage() {
        setProgrammingLanguages([...programmingLanguages, { id: generateId(), technology: '' }]);
    }
    function deleteProgrammingLanguage(id: string) {
        setProgrammingLanguages(programmingLanguages.filter(item => item.id !== id));
    }

    async function handleGeneratePdf() {
        const payload = {
            personalInfo,
            experience,
            education,
            projects,
            technologies,
            programmingLanguages,
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
        <div className="grid grid-cols-2">
            <div className="flex flex-col gap-12 p-12">
                {/* Personal Info */}
                <div>
                    <SectionTitle title="Personal Info" />
                    <GridInputsContainer>
                        <TextInput label="Name" name="name" type="text" placeholder="Enter your name" value={personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
                        <TextInput label="Email" name="email" type="email" placeholder="Enter your email" value={personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                        <TextInput label="Phone" name="phone" type="tel" placeholder="Enter your phone" value={personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                        <TextInput label="Job Title" name="jobTitle" type="text" placeholder="Enter your job title" value={personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} />
                        <TextInput label="City" name="city" type="text" placeholder="Enter your city" value={personalInfo.city} onChange={(e) => updatePersonalInfo('city', e.target.value)} />
                        <TextInput label="Important url (Github, linkedin, ...)" name="github" type="text" placeholder="Enter your url" value={personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
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
                {/* Technologies */}
                <div>
                    <SectionTitle title="Technologies" />
                    <div className="flex flex-col gap-4">
                        {technologies.map((technology) => (
                            <DropdownMenu title={technology.technology} onDelete={() => deleteTechnology(technology.id)} key={technology.id}>
                                <TextInput label="Technology" name="technology" type="text" placeholder="Enter technology" value={technology.technology} onChange={(e) => updateTechnology(technology.id, e.target.value)} />
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addTechnology}><FontAwesomeIcon icon={faPlus} /> Add Technology</Button>
                    </div>
                </div>
                {/* Programming Languages */}
                <div>
                    <SectionTitle title="Programming Languages" />
                    <div className="flex flex-col gap-4">
                        {programmingLanguages.map((programmingLanguage) => (
                            <DropdownMenu title={programmingLanguage.technology} onDelete={() => deleteProgrammingLanguage(programmingLanguage.id)} key={programmingLanguage.id}>
                                <TextInput label="Programming Language" name="programmingLanguage" type="text" placeholder="Enter programming language" value={programmingLanguage.technology} onChange={(e) => updateProgrammingLanguage(programmingLanguage.id, e.target.value)} />
                            </DropdownMenu>
                        ))}
                        <Button variant="link" onClick={addProgrammingLanguage}><FontAwesomeIcon icon={faPlus} /> Add Programming Language</Button>
                    </div>
                </div>
            </div>
            <div className="bg-gray-700 flex flex-col items-center gap-8 pt-6">
                <button onClick={handleGeneratePdf} className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-md self-end mr-12 cursor-pointer">Generate PDF</button>
                <Cv1 personalInfo={personalInfo} experience={experience} education={education} projects={projects} technologies={technologies} programmingLanguages={programmingLanguages} />
            </div>
        </div>
    )
}
