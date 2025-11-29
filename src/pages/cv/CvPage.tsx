import DropdownMenu from "../../ui/cv-editing-section/DropdownMenu";
import GridInputsContainer from "../../ui/cv-editing-section/GridInputsContainer";
import SectionTitle from "../../ui/cv-editing-section/SectionTitle";
import TextAreaInput from "../../ui/cv-editing-section/inputs/TextAreaInput";
import TextInput from "../../ui/cv-editing-section/inputs/TextInput";
import type { Education, Experience, Project, Skill } from "../../apis/types";
import { useState } from "react";
import Button from "../../ui/cv-editing-section/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faFileLines } from "@fortawesome/free-solid-svg-icons";
import Cv1 from "./cvs/Cv1";
import { saveAs } from "file-saver";

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function CvPage() {
    const [showCvOnSmall, setShowCvOnSmall] = useState(true);
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
            description: '- 1\n- 2\n- 3\n- 4\n- 5\n- 6\n- 7\n- 8\n- 9\n- 10\n- 11\n- 12\n- 13\n- 14\n- 15\n- 16\n- 17\n- 18\n- 19\n- 20\n- 21\n- 22\n- 23\n- 24\n- 25\n- 26\n- 27\n- 28\n- 29\n- 30\n- 31\n- 32\n- 33\n- 34\n- 35\n- 36\n- 37\n- 38\n- 39\n- 40\n- 41\n- 42\n- 43\n- 44\n- 45\n- 46\n- 47\n- 48\n- 49\n- 50\n- 51\n- 52\n- 53\n- 54\n- 55\n- 56\n- 57\n- 58\n- 59\n- 60\n- 61\n- 62\n- 63\n- 64\n- 65\n- 66\n- 67\n- 68\n- 69\n- 70\n- 71\n- 72\n- 73\n- 74\n- 75\n- 76\n- 77\n- 78\n- 79\n- 80\n- 81\n- 82\n- 83\n- 84\n- 85\n- 86\n- 87\n- 88\n- 89\n- 90\n- 91\n- 92\n- 93\n- 94\n- 95\n- 96\n- 97\n- 98\n- 99\n- 100',
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
            description: '1'
        },
        {
            id: '2',
            description: '2'
        },
        {
            id: '3',
            description: '3'
        },
        {
            id: '4',
            description: '4'
        },
        {
            id: '5',
            description: '5'
        },
        {
            id: '6',
            description: '6'
        },
        {
            id: '7',
            description: '7'
        },
        {
            id: '8',
            description: '8'
        },
        {
            id: '9',
            description: '9'
        },
        {
            id: '10',
            description: '10'
        },
        {
            id: '11',
            description: '11'
        },
        {
            id: '12',
            description: '12'
        },
        {
            id: '13',
            description: '13'
        },
        {
            id: '14',
            description: '14'
        },
        {
            id: '15',
            description: '15'
        },
        {
            id: '16',
            description: '16'
        },
        {
            id: '17',
            description: '17'
        },
        {
            id: '18',
            description: '18'
        },
        {
            id: '19',
            description: '19'
        },
        {
            id: '20',
            description: '20'
        },
        {
            id: '21',
            description: '21'
        },
        {
            id: '22',
            description: '22'
        },
        {
            id: '23',
            description: '23'
        },
        {
            id: '24',
            description: '24'
        },
        {
            id: '25',
            description: '25'
        },
        {
            id: '26',
            description: '26'
        },
        {
            id: '27',
            description: '27'
        },
        {
            id: '28',
            description: '28'
        },
        {
            id: '29',
            description: '29'
        },
        {
            id: '30',
            description: '30'
        },
        {
            id: '31',
            description: '31'
        },
        {
            id: '32',
            description: '32'
        },
        {
            id: '33',
            description: '33'
        },
        {
            id: '34',
            description: '34'
        },
        {
            id: '35',
            description: '35'
        },
        {
            id: '36',
            description: '36'
        },
        {
            id: '37',
            description: '37'
        },
        {
            id: '38',
            description: '38'
        },
        {
            id: '39',
            description: '39'
        },
        {
            id: '40',
            description: '40'
        },
        {
            id: '41',
            description: '41'
        },
        {
            id: '42',
            description: '42'
        },
        {
            id: '43',
            description: '43'
        },
        {
            id: '44',
            description: '44'
        },
        {
            id: '45',
            description: '45'
        },
        {
            id: '46',
            description: '46'
        },
        {
            id: '47',
            description: '47'
        },
        {
            id: '48',
            description: '48'
        },
        {
            id: '49',
            description: '49'
        },
        {
            id: '50',
            description: '50'
        },
        {
            id: '51',
            description: '51'
        },
        {
            id: '52',
            description: '52'
        },
        {
            id: '53',
            description: '53'
        },
        {
            id: '54',
            description: '54'
        },
        {
            id: '55',
            description: '55'
        },
        {
            id: '56',
            description: '56'
        },
        {
            id: '57',
            description: '57'
        },
        {
            id: '58',
            description: '58'
        },
        {
            id: '59',
            description: '59'
        },
        {
            id: '60',
            description: '60'
        },
        {
            id: '61',
            description: '61'
        },
        {
            id: '62',
            description: '62'
        },
        {
            id: '63',
            description: '63'
        },
        {
            id: '64',
            description: '64'
        },
        {
            id: '65',
            description: '65'
        },
        {
            id: '66',
            description: '66'
        },
        {
            id: '67',
            description: '67'
        },
        {
            id: '68',
            description: '68'
        },
        {
            id: '69',
            description: '69'
        },
        {
            id: '70',
            description: '70'
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

    const updateSkills = (id: string, value: string) => {
        setSkills(prev => prev.map(item =>
            item.id === id ? { ...item, description: value } : item
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
    function addSkill() {
        setSkills([...skills, { id: generateId(), description: '' }]);
    }
    function deleteSkill(id: string) {
        setSkills(skills.filter(item => item.id !== id));
    }
    function addProject() {
        setProjects([...projects, { id: generateId(), name: '', description: '', technologies: [] }]);
    }
    function deleteProject(id: string) {
        setProjects(projects.filter(item => item.id !== id));
    }
    

    async function handleGeneratePdf() {
        const payload = {
            personalInfo,
            experience,
            education,
            projects,
            skills,
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
            </div>
            <div className={`bg-gray-700 ${showCvOnSmall ? 'flex' : 'hidden'} w-dvw h-dvh xl:w-auto xl:h-auto xl:flex flex-col items-center`}>
                <button onClick={handleGeneratePdf} className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-md self-end mr-4 cursor-pointer fixed top-2 z-10">Generate PDF</button>
                <Cv1 personalInfo={personalInfo} experience={experience} education={education} projects={projects} skills={skills} />
            </div>
            <button onClick={() => setShowCvOnSmall(prev => !prev)} className="xl:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center z-50 cursor-pointer" aria-label={showCvOnSmall ? 'Open editor' : 'Open CV preview'}>
                <FontAwesomeIcon icon={showCvOnSmall ? faPenToSquare : faFileLines} />
            </button>
        </div>
    )
}
