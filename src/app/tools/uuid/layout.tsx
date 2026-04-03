import { metadataForTool } from "@/lib/tool-metadata";

export const metadata = metadataForTool("uuid");

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}

