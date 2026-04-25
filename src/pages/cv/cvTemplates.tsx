import type { ComponentType } from "react";
import Cv1 from "./cvs/Cv1";
import type { CvTemplateProps } from "./cvTemplateTypes";
import cv1Img from "../../assets/cv1.png";

export const CV_TEMPLATES: Record<string, ComponentType<CvTemplateProps>> = {
    cv1: Cv1,
};

export interface CvTemplateMeta {
    id: string;
    label: string;
    image: string;
}

export const CV_TEMPLATE_META: CvTemplateMeta[] = [
    { id: "cv1", label: "Classic", image: cv1Img },
];

export const DEFAULT_CV_TEMPLATE_ID = "cv1";

export function resolveCvTemplate(id: string | null | undefined): ComponentType<CvTemplateProps> {
    if (id && CV_TEMPLATES[id]) return CV_TEMPLATES[id];
    return CV_TEMPLATES[DEFAULT_CV_TEMPLATE_ID];
}
