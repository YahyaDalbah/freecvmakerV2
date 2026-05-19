import DropdownMenu from "../../ui/cv-editing-section/DropdownMenu";
import GridInputsContainer from "../../ui/cv-editing-section/GridInputsContainer";
import SectionTitle from "../../ui/cv-editing-section/SectionTitle";
import TextAreaInput from "../../ui/cv-editing-section/inputs/TextAreaInput";
import TextInput from "../../ui/cv-editing-section/inputs/TextInput";
import SelectInput from "../../ui/cv-editing-section/inputs/SelectInput";
import type { Education, Experience, Project, Skill, Reference } from "../../apis/types";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "../../ui/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faFileLines, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import CvLivePreview from "./CvLivePreview";
import Templates from "./Templates";
import { fetchCvPdfBlob } from "../../apis/cvPdfApi";
import { DEFAULT_CV_TEMPLATE_ID, templateShowsSkillLevel } from "./cvTemplates";
import { COLOR_PRESETS } from "./Templates";
import { saveAs } from "file-saver";
import { AutoSaveProvider, useAutoSave } from "../../contexts/AutoSaveContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { RootLayoutOutletContext } from "../../layoutContext";
import AutoSaveIndicator from "../../ui/AutoSaveIndicator";
import {
    getCvData,
    updateCvData,
    isAuthenticated,
    getCvDataFromLocalStorage,
    saveCvDataToLocalStorage,
    normalizeSectionOrder,
    type CvData,
    type CvSectionId,
} from "../../apis/cvApi";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const ITEM_PREFIX = {
    experience: "item:experience:",
    education: "item:education:",
    projects: "item:projects:",
    skills: "item:skills:",
    references: "item:references:",
} as const;

type ItemKind = keyof typeof ITEM_PREFIX;

function parseItemComposite(composite: string): { kind: ItemKind; itemId: string } | null {
    for (const kind of Object.keys(ITEM_PREFIX) as ItemKind[]) {
        const p = ITEM_PREFIX[kind];
        if (composite.startsWith(p)) {
            return { kind, itemId: composite.slice(p.length) };
        }
    }
    return null;
}

function SortableEditorSection({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} className="relative min-w-0">
            <button
                type="button"
                className="absolute right-full mr-1 p-1 text-gray-500 hover:text-gray-800 cursor-grab active:cursor-grabbing touch-none z-10"
                aria-label="Drag to reorder section"
                {...attributes}
                {...listeners}
            >
                <FontAwesomeIcon icon={faGripVertical} />
            </button>
            <div className="min-w-0 flex flex-col gap-4">{children}</div>
        </div>
    );
}

function SortableListRow({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} className="relative min-w-0">
            <button
                type="button"
                className="absolute right-full top-1/2 -translate-y-1/2 mr-1 p-1 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing touch-none z-10"
                aria-label="Drag to reorder item"
                {...attributes}
                {...listeners}
            >
                <FontAwesomeIcon icon={faGripVertical} />
            </button>
            <div className="min-w-0">{children}</div>
        </div>
    );
}

function CvPageContent() {
    const { registerCvGeneratePdf, cvEditorTab } = useOutletContext<RootLayoutOutletContext>();
    const { status: autoSaveStatus, startSaving, finishSaving } = useAutoSave();
    const [showCvOnSmall, setShowCvOnSmall] = useState(true);
    const isLargeScreen = useMediaQuery("(min-width: 1024px)");
    /** Small: editor vs preview toggle. Preview stays mounted (hidden) so the PDF iframe is not torn down. */
    const mobilePreviewOnTop = !isLargeScreen && showCvOnSmall;
    const [isLoading, setIsLoading] = useState(true);
    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        city: "",
        links: ["", "", ""],
    });

    const [professionalSummary, setProfessionalSummary] = useState("");
    const [templateId, setTemplateId] = useState(DEFAULT_CV_TEMPLATE_ID);
    const [color, setColor] = useState(COLOR_PRESETS[0]);
    const [sectionOrder, setSectionOrder] = useState<CvSectionId[]>(() => normalizeSectionOrder(null));
    const [experience, setExperience] = useState<Experience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [references, setReferences] = useState<Reference[]>([]);

    const dataLoadedRef = useRef(false);
    const saveTimeoutRef = useRef<number | null>(null);
    const isFirstLoadRef = useRef(true);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            const a = String(active.id);
            const o = String(over.id);

            if (a.startsWith("section:") && o.startsWith("section:")) {
                const fromKey = a.slice("section:".length) as CvSectionId;
                const toKey = o.slice("section:".length) as CvSectionId;
                setSectionOrder((prev) => {
                    const fi = prev.indexOf(fromKey);
                    const ti = prev.indexOf(toKey);
                    if (fi < 0 || ti < 0) return prev;
                    return arrayMove(prev, fi, ti);
                });
                return;
            }

            const activeItem = parseItemComposite(a);
            const overItem = parseItemComposite(o);
            if (!activeItem || !overItem || activeItem.kind !== overItem.kind) return;

            const reorder = (arr: { id: string }[], setArr: React.Dispatch<React.SetStateAction<Experience[] | Education[] | Project[] | Skill[] | Reference[]>>) => {
                const oldIndex = arr.findIndex((x) => x.id === activeItem.itemId);
                const newIndex = arr.findIndex((x) => x.id === overItem.itemId);
                if (oldIndex < 0 || newIndex < 0) return;
                setArr(arrayMove(arr, oldIndex, newIndex) as never);
            };

            switch (activeItem.kind) {
                case "experience":
                    reorder(experience, setExperience);
                    break;
                case "education":
                    reorder(education, setEducation);
                    break;
                case "projects":
                    reorder(projects, setProjects);
                    break;
                case "skills":
                    reorder(skills, setSkills);
                    break;
                case "references":
                    reorder(references, setReferences);
                    break;
                default:
                    break;
            }
        },
        [experience, education, projects, skills, references]
    );

    useEffect(() => {
        const loadCvData = async () => {
            try {
                let data: CvData | null = null;

                if (isAuthenticated()) {
                    data = await getCvData();
                } else {
                    data = getCvDataFromLocalStorage();
                }

                if (data) {
                    setPersonalInfo({
                        firstName: data.personalInfo?.firstName || "",
                        lastName: data.personalInfo?.lastName || "",
                        email: data.personalInfo?.email || "",
                        phone: data.personalInfo?.phone || "",
                        jobTitle: data.personalInfo?.jobTitle || "",
                        city: data.personalInfo?.city || "",
                        links: data.personalInfo?.links || ["", "", ""],
                    });
                    setProfessionalSummary(data.professionalSummary || "");
                    setTemplateId(data.templateId || DEFAULT_CV_TEMPLATE_ID);
                    setColor(data.color || COLOR_PRESETS[0]);
                    setSectionOrder(normalizeSectionOrder(data.sectionOrder));
                    setExperience(data.experience || []);
                    setEducation(data.education || []);
                    setSkills(data.skills || []);
                    setProjects(data.projects || []);
                    setReferences(data.references || []);
                }
            } catch (error) {
                console.error("Failed to load CV data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCvData();
    }, []);

    useEffect(() => {
        if (!isLoading && isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            setTimeout(() => {
                dataLoadedRef.current = true;
            }, 1000);
        }
    }, [isLoading]);

    const saveCvData = useCallback(async () => {
        try {
            startSaving();
            const cvData: CvData = {
                personalInfo,
                professionalSummary,
                templateId,
                color,
                sectionOrder,
                experience,
                education,
                skills,
                projects,
                references,
            };

            if (isAuthenticated()) {
                await updateCvData(cvData);
            } else {
                saveCvDataToLocalStorage(cvData);
            }

            finishSaving();
        } catch (error) {
            console.error("Failed to save CV data:", error);
            finishSaving(true);
        }
    }, [
        personalInfo,
        professionalSummary,
        templateId,
        color,
        sectionOrder,
        experience,
        education,
        skills,
        projects,
        references,
        startSaving,
        finishSaving,
    ]);

    useEffect(() => {
        if (!dataLoadedRef.current) {
            return;
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveCvData();
        }, 900);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [personalInfo, professionalSummary, templateId, color, sectionOrder, experience, education, skills, projects, references, saveCvData]);

    const updatePersonalInfo = useCallback((field: keyof typeof personalInfo, value: string | string[]) => {
        setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    }, []);

    const updateLink = useCallback((index: number, value: string) => {
        setPersonalInfo((prev) => {
            const newLinks = [...(prev.links || ["", "", ""])];
            newLinks[index] = value;
            return { ...prev, links: newLinks };
        });
    }, []);

    const updateExperience = useCallback((id: string, field: keyof Experience, value: string) => {
        setExperience((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    }, []);

    const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
        setEducation((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    }, []);

    const updateSkills = useCallback((id: string, value: string) => {
        setSkills((prev) => prev.map((item) => (item.id === id ? { ...item, description: value } : item)));
    }, []);

    const updateSkillLevel = useCallback((id: string, level: number) => {
        setSkills((prev) => prev.map((item) => (item.id === id ? { ...item, level } : item)));
    }, []);

    const updateProject = useCallback((id: string, field: keyof Project, value: string | string[]) => {
        setProjects((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    }, []);

    const updateReference = useCallback((id: string, field: keyof Reference, value: string) => {
        setReferences((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    }, []);

    const addExperience = useCallback(() => {
        setExperience((prev) => [
            ...prev,
            {
                id: generateId(),
                jobTitle: "",
                company: "",
                startDate: "",
                endDate: "",
                description: "",
                city: "",
                github: "",
            },
        ]);
    }, []);

    const deleteExperience = useCallback((id: string) => {
        setExperience((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addEducation = useCallback(() => {
        setEducation((prev) => [
            ...prev,
            {
                id: generateId(),
                school: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ]);
    }, []);

    const deleteEducation = useCallback((id: string) => {
        setEducation((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addSkill = useCallback(() => {
        setSkills((prev) => [...prev, { id: generateId(), description: "", level: 3 }]);
    }, []);

    const deleteSkill = useCallback((id: string) => {
        setSkills((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addProject = useCallback(() => {
        setProjects((prev) => [...prev, { id: generateId(), name: "", description: "", technologies: [] }]);
    }, []);

    const deleteProject = useCallback((id: string) => {
        setProjects((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addReference = useCallback(() => {
        setReferences((prev) => [
            ...prev,
            { id: generateId(), name: "", company: "", email: "", phone: "", description: "" },
        ]);
    }, []);

    const deleteReference = useCallback((id: string) => {
        setReferences((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const pdfPayload = useMemo(
        () => ({
            template: templateId,
            color,
            personalInfo,
            professionalSummary,
            sectionOrder,
            experience,
            education,
            projects,
            skills,
            references,
        }),
        [personalInfo, professionalSummary, templateId, color, sectionOrder, experience, education, projects, skills, references]
    );


    const handleGeneratePdf = useCallback(async () => {
        try {
            const blob = await fetchCvPdfBlob(pdfPayload);
            saveAs(blob, "cv.pdf");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error generating PDF");
        }
    }, [pdfPayload]);

    useEffect(() => {
        if (isLoading) {
            registerCvGeneratePdf(null);
            return;
        }
        registerCvGeneratePdf(handleGeneratePdf);
        return () => registerCvGeneratePdf(null);
    }, [isLoading, registerCvGeneratePdf, handleGeneratePdf]);

    const sectionSortableIds = useMemo(() => sectionOrder.map((s) => `section:${s}`), [sectionOrder]);

    const renderOrderedSection = (sectionId: CvSectionId) => {
        switch (sectionId) {
            case "professionalSummary":
                return (
                    <>
                        <SectionTitle title="Professional Summary" />
                        <TextAreaInput
                            span={true}
                            label="Summary"
                            name="professionalSummary"
                            value={professionalSummary}
                            onChange={(value) => setProfessionalSummary(value)}
                        />
                    </>
                );
            case "experience":
                return (
                    <>
                        <SectionTitle title="Experience" />
                        <SortableContext
                            items={experience.map((e) => `${ITEM_PREFIX.experience}${e.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-4">
                                {experience.map((exp) => (
                                    <SortableListRow key={exp.id} id={`${ITEM_PREFIX.experience}${exp.id}`}>
                                        <DropdownMenu title={exp.jobTitle} onDelete={() => deleteExperience(exp.id)}>
                                            <GridInputsContainer>
                                                <TextInput
                                                    label="Job Title"
                                                    name="jobTitle"
                                                    type="text"
                                                    placeholder="Enter job title"
                                                    value={exp.jobTitle}
                                                    onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                                                />
                                                <TextInput
                                                    label="Company"
                                                    name="company"
                                                    type="text"
                                                    placeholder="Enter company"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                                />
                                                <div className="date-input">
                                                    <TextInput
                                                        label="Start & End Date"
                                                        name="startDate"
                                                        type="text"
                                                        placeholder="Enter start date"
                                                        value={exp.startDate}
                                                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                                    />
                                                    <TextInput
                                                        name="endDate"
                                                        type="text"
                                                        placeholder="Enter end date"
                                                        value={exp.endDate}
                                                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                                    />
                                                </div>
                                                <TextInput
                                                    label="City"
                                                    name="city"
                                                    type="text"
                                                    placeholder="Enter city"
                                                    value={exp.city}
                                                    onChange={(e) => updateExperience(exp.id, "city", e.target.value)}
                                                />
                                                <TextAreaInput
                                                    span={true}
                                                    label="Description"
                                                    name="description"
                                                    value={exp.description}
                                                    onChange={(value) => updateExperience(exp.id, "description", value)}
                                                />
                                            </GridInputsContainer>
                                        </DropdownMenu>
                                    </SortableListRow>
                                ))}
                            </div>
                        </SortableContext>
                        <Button variant="ghost" onClick={addExperience}>
                            <FontAwesomeIcon icon={faPlus} /> Add Experience
                        </Button>
                    </>
                );
            case "education":
                return (
                    <>
                        <SectionTitle title="Education" />
                        <SortableContext
                            items={education.map((e) => `${ITEM_PREFIX.education}${e.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-4">
                                {education.map((edu) => (
                                    <SortableListRow key={edu.id} id={`${ITEM_PREFIX.education}${edu.id}`}>
                                        <DropdownMenu
                                            title={
                                                edu.school && edu.degree
                                                    ? edu.school + " - " + edu.degree
                                                    : "(Untitled)"
                                            }
                                            onDelete={() => deleteEducation(edu.id)}
                                        >
                                            <GridInputsContainer>
                                                <TextInput
                                                    label="School"
                                                    name="school"
                                                    type="text"
                                                    placeholder="Enter school"
                                                    value={edu.school}
                                                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                                                />
                                                <TextInput
                                                    label="Degree"
                                                    name="degree"
                                                    type="text"
                                                    placeholder="Enter degree"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                                />
                                                <div className="date-input">
                                                    <TextInput
                                                        label="Start & End Date"
                                                        name="startDate"
                                                        type="text"
                                                        placeholder="Enter start date"
                                                        value={edu.startDate}
                                                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                                    />
                                                    <TextInput
                                                        name="endDate"
                                                        type="text"
                                                        placeholder="Enter end date"
                                                        value={edu.endDate}
                                                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                                    />
                                                </div>
                                                <TextInput
                                                    label="Field of Study"
                                                    name="fieldOfStudy"
                                                    type="text"
                                                    placeholder="Enter field of study"
                                                    value={edu.fieldOfStudy}
                                                    onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                                                />
                                                <TextAreaInput
                                                    span={true}
                                                    label="Description"
                                                    name="description"
                                                    value={edu.description}
                                                    onChange={(value) => updateEducation(edu.id, "description", value)}
                                                />
                                            </GridInputsContainer>
                                        </DropdownMenu>
                                    </SortableListRow>
                                ))}
                            </div>
                        </SortableContext>
                        <Button variant="ghost" onClick={addEducation}>
                            <FontAwesomeIcon icon={faPlus} /> Add Education
                        </Button>
                    </>
                );
            case "projects":
                return (
                    <>
                        <SectionTitle title="Projects" />
                        <SortableContext
                            items={projects.map((p) => `${ITEM_PREFIX.projects}${p.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-4">
                                {projects.map((project) => (
                                    <SortableListRow key={project.id} id={`${ITEM_PREFIX.projects}${project.id}`}>
                                        <DropdownMenu title={project.name} onDelete={() => deleteProject(project.id)}>
                                            <GridInputsContainer>
                                                <TextInput
                                                    label="Project"
                                                    name="project"
                                                    type="text"
                                                    placeholder="Enter project"
                                                    value={project.name}
                                                    onChange={(e) => updateProject(project.id, "name", e.target.value)}
                                                />
                                                <TextInput
                                                    label="Technologies"
                                                    name="technologies"
                                                    type="text"
                                                    placeholder="Enter technologies"
                                                    value={project.technologies?.join(", ")}
                                                    onChange={(e) =>
                                                        updateProject(
                                                            project.id,
                                                            "technologies",
                                                            e.target.value
                                                                .split(",")
                                                                .map((tech) => tech.trim())
                                                                .filter((tech) => tech)
                                                        )
                                                    }
                                                />
                                                <TextAreaInput
                                                    span={true}
                                                    label="Description"
                                                    name="description"
                                                    value={project.description}
                                                    onChange={(value) => updateProject(project.id, "description", value)}
                                                />
                                            </GridInputsContainer>
                                        </DropdownMenu>
                                    </SortableListRow>
                                ))}
                            </div>
                        </SortableContext>
                        <Button variant="ghost" onClick={addProject}>
                            <FontAwesomeIcon icon={faPlus} /> Add Project
                        </Button>
                    </>
                );
            case "skills":
                return (
                    <>
                        <SectionTitle title="Skills" />
                        <SortableContext
                            items={skills.map((s) => `${ITEM_PREFIX.skills}${s.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-4">
                                {skills.map((skill) => (
                                    <SortableListRow key={skill.id} id={`${ITEM_PREFIX.skills}${skill.id}`}>
                                        <DropdownMenu title={skill.description} onDelete={() => deleteSkill(skill.id)}>
                                            <GridInputsContainer>
                                                <TextInput
                                                    name="skillsDescription"
                                                    label="Skill"
                                                    type="text"
                                                    placeholder="Enter skill name"
                                                    value={skill.description}
                                                    onChange={(e) => updateSkills(skill.id, e.target.value)}
                                                />
                                                {templateShowsSkillLevel(templateId) && (
                                                    <SelectInput
                                                        name="skillLevel"
                                                        label="Level (1–5)"
                                                        value={skill.level ?? 3}
                                                        onChange={(val) => updateSkillLevel(skill.id, val)}
                                                        min={1}
                                                        max={5}
                                                    />
                                                )}
                                            </GridInputsContainer>
                                        </DropdownMenu>
                                    </SortableListRow>
                                ))}
                            </div>
                        </SortableContext>
                        <Button variant="ghost" onClick={addSkill}>
                            <FontAwesomeIcon icon={faPlus} /> Add Skill
                        </Button>
                    </>
                );
            case "references":
                return (
                    <>
                        <SectionTitle title="References" />
                        <SortableContext
                            items={references.map((r) => `${ITEM_PREFIX.references}${r.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-4">
                                {references.map((reference) => (
                                    <SortableListRow key={reference.id} id={`${ITEM_PREFIX.references}${reference.id}`}>
                                        <DropdownMenu title={reference.name} onDelete={() => deleteReference(reference.id)}>
                                            <GridInputsContainer>
                                                <TextInput
                                                    label="Name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter name"
                                                    value={reference.name}
                                                    onChange={(e) => updateReference(reference.id, "name", e.target.value)}
                                                />
                                                <TextInput
                                                    label="Company"
                                                    name="company"
                                                    type="text"
                                                    placeholder="Enter company"
                                                    value={reference.company}
                                                    onChange={(e) => updateReference(reference.id, "company", e.target.value)}
                                                />
                                                <TextInput
                                                    label="Email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={reference.email}
                                                    onChange={(e) => updateReference(reference.id, "email", e.target.value)}
                                                />
                                                <TextInput
                                                    label="Phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="Enter phone"
                                                    value={reference.phone}
                                                    onChange={(e) => updateReference(reference.id, "phone", e.target.value)}
                                                />
                                                <TextAreaInput
                                                    span={true}
                                                    label="Description"
                                                    name="description"
                                                    value={reference.description}
                                                    onChange={(value) => updateReference(reference.id, "description", value)}
                                                />
                                            </GridInputsContainer>
                                        </DropdownMenu>
                                    </SortableListRow>
                                ))}
                            </div>
                        </SortableContext>
                        <Button variant="ghost" onClick={addReference}>
                            <FontAwesomeIcon icon={faPlus} /> Add Reference
                        </Button>
                    </>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Loading CV data...</div>
            </div>
        );
    }

    return (
        <>
            <div
                className={`min-h-dvh flex-col gap-12 bg-gray-50 px-4 py-6 pt-20 sm:px-8 lg:min-h-screen lg:pb-12 lg:pl-12 lg:pr-[calc(50%+1.5rem)] lg:pt-24 ${
                    showCvOnSmall && !isLargeScreen ? "hidden lg:flex" : "flex"
                } ${mobilePreviewOnTop ? "pb-[calc(min(42dvh,400px)+2rem)]" : ""}`}
            >
                {cvEditorTab === "editing" ? (
                    <>
                        <div>
                            <SectionTitle title="Personal Info" />
                            <GridInputsContainer>
                                <TextInput
                                    label="First Name"
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={personalInfo.firstName}
                                    onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                                />
                                <TextInput
                                    label="Last Name"
                                    name="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={personalInfo.lastName}
                                    onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                                />
                                <TextInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={personalInfo.email}
                                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                                />
                                <TextInput
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone"
                                    value={personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                                />
                                <TextInput
                                    label="Job Title"
                                    name="jobTitle"
                                    type="text"
                                    placeholder="Enter your job title"
                                    value={personalInfo.jobTitle}
                                    onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                                />
                                <TextInput
                                    label="City"
                                    name="city"
                                    type="text"
                                    placeholder="Enter your city"
                                    value={personalInfo.city}
                                    onChange={(e) => updatePersonalInfo("city", e.target.value)}
                                />
                                <TextInput
                                    label="Link 1 (Github, Linkedin, Portfolio, ...)"
                                    name="link1"
                                    type="text"
                                    placeholder="Enter your url"
                                    value={personalInfo.links?.[0] || ""}
                                    onChange={(e) => updateLink(0, e.target.value)}
                                />
                                <TextInput
                                    label="Link 2 (Github, Linkedin, Portfolio, ...)"
                                    name="link2"
                                    type="text"
                                    placeholder="Enter your url"
                                    value={personalInfo.links?.[1] || ""}
                                    onChange={(e) => updateLink(1, e.target.value)}
                                />
                                <TextInput
                                    label="Link 3 (Github, Linkedin, Portfolio, ...)"
                                    name="link3"
                                    type="text"
                                    placeholder="Enter your url"
                                    value={personalInfo.links?.[2] || ""}
                                    onChange={(e) => updateLink(2, e.target.value)}
                                />
                            </GridInputsContainer>
                        </div>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={sectionSortableIds} strategy={verticalListSortingStrategy}>
                                <div className="flex flex-col gap-12">
                                    {sectionOrder.map((sectionId) => (
                                        <SortableEditorSection key={sectionId} id={`section:${sectionId}`}>
                                            {renderOrderedSection(sectionId)}
                                        </SortableEditorSection>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </>
                ) : (
                    <Templates
                        selectedTemplateId={templateId}
                        onSelect={setTemplateId}
                        selectedColor={color}
                        onColorChange={setColor}
                    />
                )}
            </div>

            <div
                className={`fixed inset-x-0 bottom-0 z-40 flex h-full flex-col overflow-hidden bg-gray-700 p-3 sm:p-4 lg:inset-x-auto lg:bottom-0 lg:left-auto lg:right-0 lg:top-14 lg:h-auto lg:min-h-0 lg:w-1/2 lg:max-w-[50vw] ${
                    !isLargeScreen && !showCvOnSmall ? "invisible pointer-events-none" : ""
                } lg:visible lg:pointer-events-auto`}
                aria-label="CV preview"
                aria-hidden={!isLargeScreen && !showCvOnSmall}
            >
                <div
                    className={`relative min-h-0 flex-1 overflow-y-auto ${!isLargeScreen ? "pt-14" : ""}`}
                >
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            Loading CV data…
                        </div>
                    ) : (
                        <div className="p-3">
                            <CvLivePreview
                                templateId={templateId}
                                color={color}
                                personalInfo={personalInfo}
                                professionalSummary={professionalSummary}
                                sectionOrder={sectionOrder}
                                experience={experience}
                                education={education}
                                projects={projects}
                                skills={skills}
                                references={references}
                            />
                        </div>
                    )}
                </div>
            </div>

            {!isLargeScreen && (
                <button
                    type="button"
                    onClick={() => setShowCvOnSmall((prev) => !prev)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                    aria-label={showCvOnSmall ? "Open editor" : "Open CV preview"}
                >
                    <FontAwesomeIcon icon={showCvOnSmall ? faPenToSquare : faFileLines} />
                </button>
            )}

            <AutoSaveIndicator status={autoSaveStatus} />
        </>
    );
}

export default function CvPage() {
    return (
        <AutoSaveProvider>
            <CvPageContent />
        </AutoSaveProvider>
    );
}
