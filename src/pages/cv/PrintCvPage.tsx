import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Education, Experience, PersonalInfo, Project, Reference, Skill } from "../../apis/types";
import { normalizeSectionOrder } from "../../apis/cvApi";
import { resolveCvTemplate, DEFAULT_CV_TEMPLATE_ID } from "./cvTemplates";

const SESSION_KEY = "cv-print-payload";

function decodeCvData(encodedData: string) {
    const base64 = decodeURIComponent(encodedData);
    const binaryStr = atob(base64);
    const jsonStr = new TextDecoder().decode(Uint8Array.from(binaryStr, (c) => c.charCodeAt(0)));
    return JSON.parse(jsonStr);
}

type StoredPayload = {
    template?: string;
    color?: string;
    personalInfo: PersonalInfo;
    professionalSummary?: string;
    sectionOrder?: string[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: Skill[];
    references: Reference[];
};

function emptyPayload(): StoredPayload {
    return {
        personalInfo: {},
        professionalSummary: "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        references: [],
    };
}

export default function PrintCvPage() {
    const [params] = useSearchParams();
    const source = params.get("source");
    const templateParam = params.get("template");

    const data = useMemo((): StoredPayload => {
        if (source === "session") {
            try {
                const raw = sessionStorage.getItem(SESSION_KEY);
                if (!raw) return emptyPayload();
                return { ...emptyPayload(), ...JSON.parse(raw) };
            } catch {
                return emptyPayload();
            }
        }
        try {
            const encoded = params.get("data") ?? "";
            if (!encoded) return emptyPayload();
            const json = decodeCvData(encoded);
            return { ...emptyPayload(), ...json };
        } catch {
            return emptyPayload();
        }
    }, [source, params]);

    const templateId = templateParam || data.template || DEFAULT_CV_TEMPLATE_ID;
    const Template = resolveCvTemplate(templateId);
    const sectionOrder = normalizeSectionOrder(data.sectionOrder);

    return (
        <div className="bg-white print:bg-white">
            <Template
                variant="print"
                color={data.color}
                personalInfo={data.personalInfo}
                professionalSummary={data.professionalSummary}
                sectionOrder={sectionOrder}
                experience={data.experience}
                education={data.education}
                projects={data.projects}
                skills={data.skills}
                references={data.references}
            />
        </div>
    );
}
