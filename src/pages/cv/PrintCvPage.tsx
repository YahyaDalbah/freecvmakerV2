import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Cv1 from "./cvs/Cv1";
import type { Education, Experience, PersonalInfo, Project, Technology } from "../../apis/types";

export default function PrintCvPage() {
  const [params] = useSearchParams();
  function decodeCvData(encodedData: string) {
    // Step 1: Undo URL encoding
    const base64 = decodeURIComponent(encodedData);

    // Step 2: Base64 → binary string
    const binaryStr = atob(base64);

    // Step 3: Binary string → UTF-8 text
    const jsonStr = new TextDecoder().decode(
      Uint8Array.from(binaryStr, c => c.charCodeAt(0))
    );

    // Step 4: Parse JSON
    return JSON.parse(jsonStr);
  }
  const data = useMemo(() => {
    try {
      const encoded = params.get("data") ?? "";
      const json = encoded ? decodeCvData(encoded) : {};
      return json as {
        personalInfo: PersonalInfo;
        experience: Experience[];
        education: Education[];
        projects: Project[];
        technologies: Technology[];
        programmingLanguages: Technology[];
      };
    } catch {
      return {
        personalInfo: {},
        experience: [],
        education: [],
        projects: [],
        technologies: [],
        programmingLanguages: [],
      } as any;
    }
  }, [params]);

  return (
    <Cv1
      toGenerate={true}
      personalInfo={data.personalInfo}
      experience={data.experience}
      education={data.education}
      projects={data.projects}
      technologies={data.technologies}
      programmingLanguages={data.programmingLanguages}
    />
  );
}
