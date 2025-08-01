import React, { RefObject } from "react";
import DeleteSVG from "@/components/icons/delete";
import FileSVG from "@/components/icons/file";

interface ABIRowDropdownProps {
  isOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  onDelete: () => void;
  onView: () => void;
  t: (key: string) => string;
}

const ABIRowDropdown: React.FC<ABIRowDropdownProps> = ({ isOpen, dropdownRef, onDelete, onView, t }) => {
  if (!isOpen) return null;
  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
      <button
        type="button"
        onClick={onDelete}
        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100 hover:text-red-700 flex items-center space-x-2"
      >
        <DeleteSVG />
        <span>{t("delete")}</span>
      </button>
      <button
        type="button"
        onClick={onView}
        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center space-x-2"
      >
        <FileSVG />
        <span>{t("viewABI")}</span>
      </button>
    </div>
  );
};

export default ABIRowDropdown;
