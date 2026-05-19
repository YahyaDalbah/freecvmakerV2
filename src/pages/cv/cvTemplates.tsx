import type { ComponentType } from "react";
import Cv1 from "./cvs/Cv1";
import Cv2 from "./cvs/Cv2";
import Cv3 from "./cvs/Cv3";
import type { CvTemplateProps } from "./cvTemplateTypes";
import cv1Img from "../../assets/cv1.png";
import cv2Img from "../../assets/cv2.png";
import cv3Img from "../../assets/cv3.png";

export const CV_TEMPLATES: Record<string, ComponentType<CvTemplateProps>> = {
    cv1: Cv1,
    cv2: Cv2,
    cv3: Cv3,
};

export interface CvTemplateMeta {
    id: string;
    label: string;
    image: string;
    fullBleed?: boolean;
    supportsAccentColor?: boolean;
}

export const CV_TEMPLATE_META: CvTemplateMeta[] = [
    { id: "cv1", label: "Classic", image: cv1Img },
    { id: "cv2", label: "Sidebar", image: cv2Img, fullBleed: true, supportsAccentColor: true },
    { id: "cv3", label: "Two-Column", image: cv3Img },
];

export const DEFAULT_CV_TEMPLATE_ID = "cv1";

export function resolveCvTemplate(id: string | null | undefined): ComponentType<CvTemplateProps> {
    if (id && CV_TEMPLATES[id]) return CV_TEMPLATES[id];
    return CV_TEMPLATES[DEFAULT_CV_TEMPLATE_ID];
}

export function isFullBleedTemplate(id: string | null | undefined): boolean {
    return CV_TEMPLATE_META.find(t => t.id === id)?.fullBleed ?? false;
}
