import { metadataForTool } from "@/lib/tool-metadata";

export const metadata = metadataForTool("base64");

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}

