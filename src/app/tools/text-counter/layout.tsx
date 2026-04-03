import { metadataForTool } from "@/lib/tool-metadata";

export const metadata = metadataForTool("text-counter");

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}

