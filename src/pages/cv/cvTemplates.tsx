import type { ComponentType } from "react";
import Cv1 from "./cvs/Cv1";
import Cv2 from "./cvs/Cv2";
import type { CvTemplateProps } from "./cvTemplateTypes";
import cv1Img from "../../assets/cv1.png";
import cv2Img from "../../assets/cv2.png";

export const CV_TEMPLATES: Record<string, ComponentType<CvTemplateProps>> = {
    cv1: Cv1,
    cv2: Cv2,
};

export interface CvTemplateMeta {
    id: string;
    label: string;
    image: string;
    /** True if the template has a full-bleed background (e.g. sidebar) that must extend edge-to-edge. */
    fullBleed?: boolean;
}

export const CV_TEMPLATE_META: CvTemplateMeta[] = [
    { id: "cv1", label: "Classic", image: cv1Img },
    { id: "cv2", label: "Sidebar", image: cv2Img, fullBleed: true },
];

export const DEFAULT_CV_TEMPLATE_ID = "cv1";

export function resolveCvTemplate(id: string | null | undefined): ComponentType<CvTemplateProps> {
    if (id && CV_TEMPLATES[id]) return CV_TEMPLATES[id];
    return CV_TEMPLATES[DEFAULT_CV_TEMPLATE_ID];
}

export function isFullBleedTemplate(id: string | null | undefined): boolean {
    return CV_TEMPLATE_META.find(t => t.id === id)?.fullBleed ?? false;
}
