import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";
import type { EncodingPreviewProps } from "./types";

const EncodingPreview: React.FC<EncodingPreviewProps> = ({ previewContent }) => {
  const t = useTranslations("CreateTransaction");

  return (
    // Use a flex column layout for top (header) and bottom (content) sections
    <div className="bg-white py-6 flex flex-col gap-8">
      {/* Top: Section Header */}
      <div>
        <SectionHeader title={t("preview.title")} description={t("preview.description")} />
      </div>
      {/* Bottom: Preview Content */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono whitespace-pre-wrap overflow-auto min-h-[200px]">{previewContent || t("preview.noData")}</div>
    </div>
  );
};

export default EncodingPreview;
