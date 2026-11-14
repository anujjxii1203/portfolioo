import { getWebProjects, getGraphicWorks, WebProjectContent, GraphicWorkContent } from "@/lib/content";

export const webDevProjects: WebProjectContent[] = getWebProjects();
export const graphicWorkItems: GraphicWorkContent[] = getGraphicWorks();

// Backward compatibility types
export type WebDevProject = WebProjectContent;
export type GraphicWorkItem = GraphicWorkContent;
