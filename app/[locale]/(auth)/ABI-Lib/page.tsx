"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader"; // Assuming SectionHeader is in components/ui/
import TableComponent from "@/components/ui/TableComponent"; // Assuming TableComponent is in components/
import PageLayout from "@/components/layout/PageLayout";
import { useTranslations } from "next-intl";
import AddABIForm from "./components/AddABIForm"; // Import the new form component
import ConfirmDialog from "@/components/ui/ConfirmDialog"; // Import the confirm dialog
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/userStore";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

import ViewABIForm from "./components/ViewABIForm"; // Import the view ABI form component

// Define the interface for a single ABI row based on API response
interface ABIRow {
  id: number;
  name: string;
  description: string;
  abi_content: string;
  owner: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

const ABILibPage: React.FC = () => {
  const t = useTranslations("ABI-Lib");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isAddABIOpen, setIsAddABIOpen] = useState(false);
  const [isViewABIOpen, setIsViewABIOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [abiToDelete, setAbiToDelete] = useState<ABIRow | null>(null);
  const [abis, setAbis] = useState<ABIRow[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: abiListResponse, request: fetchAbiList, error } = useApi();
  const { request: addAbi } = useApi();
  const { data: deleteAbiResponse, request: deleteAbi } = useApi();
  const { data: viewAbiResponse, request: viewAbi } = useApi();
  const { request: validateAbi } = useApi();

  const [viewAbiContent, setViewAbiContent] = useState<any>("");

  const refreshAbiList = useCallback(() => {
    if (accessToken) {
      fetchAbiList("/api/v1/abi/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  }, [accessToken, fetchAbiList]);

  useEffect(() => {
    refreshAbiList();
  }, [accessToken, refreshAbiList]); // 添加 refreshAbiList 到依赖数组

  useEffect(() => {
    if (abiListResponse?.success === true) {
      const allAbis = [...(abiListResponse.data.user_abis || []), ...(abiListResponse.data.shared_abis || [])];
      setAbis(allAbis);
      // 移除成功通知，避免页面加载时显示
    } else if (abiListResponse?.success === false && abiListResponse.data !== null) {
      console.error("Failed to fetch ABI list:", abiListResponse.error);
      toast.error(t("fetchAbiListError", { message: abiListResponse.error?.message || "Unknown error" }));
    }
  }, [abiListResponse, t]);

  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error]);

  const handleAddABI = async (name: string, description: string, abi_content: string) => {
    try {
      const validationResponse = await validateAbi("/api/v1/abi/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          abi_content,
        },
      });

      if (validationResponse?.success && validationResponse.data.is_valid) {
        const addResponse = await addAbi("/api/v1/abi", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: {
            name,
            description,
            abi_content,
          },
        });

        if (addResponse?.success) {
          toast.success(t("addAbiSuccess"));
          refreshAbiList(); // 刷新列表
          setIsAddABIOpen(false);
        } else {
          toast.error(t("addAbiError", { message: addResponse?.error?.message || "Unknown error" }));
        }
      } else {
        const errorMessage = validationResponse?.error?.message || validationResponse?.data?.error_message || "Unknown validation error";
        console.error("ABI validation failed:", errorMessage);
        toast.error(t("validateAbiError", { message: errorMessage }));
      }
    } catch (error: unknown) {
      console.error("Error in handleAddABI:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(t("addAbiError", { message: errorMessage }));
    }
  };

  const handleViewABI = async (row: ABIRow) => {
    setIsViewABIOpen(true);
    setViewAbiContent(row);
  };

  useEffect(() => {
    if (viewAbiResponse?.success === true) {
      console.log(`ABI Content for ${viewAbiResponse.data.name}:
${viewAbiResponse.data.abi_content}`);
      toast.success(t("viewAbiSuccess", { name: viewAbiResponse.data.name }));
    } else if (viewAbiResponse?.success === false && viewAbiResponse.data !== null) {
      console.error("Failed to fetch ABI details:", viewAbiResponse.error);
      toast.error(t("viewAbiError", { message: viewAbiResponse.error?.message || "Unknown error" }));
    }
  }, [viewAbiResponse, t]);

  const handleEllipsisMenu = (rowId: number) => {
    if (openDropdownId === rowId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(rowId);
    }
  };

  const handleDeleteABI = (row: ABIRow) => {
    setAbiToDelete(row);
    setIsDeleteDialogOpen(true);
    setOpenDropdownId(null);
  };

  const confirmDeleteABI = async () => {
    if (!abiToDelete) return;

    await deleteAbi(`/api/v1/abi/${abiToDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    setIsDeleteDialogOpen(false);
    setAbiToDelete(null);
  };

  const cancelDeleteABI = () => {
    setIsDeleteDialogOpen(false);
    setAbiToDelete(null);
  };

  useEffect(() => {
    if (deleteAbiResponse?.success === true) {
      console.log(`ABI deleted successfully.`);
      toast.success(t("deleteAbiSuccess"));
      refreshAbiList(); // 刷新列表
    } else if (deleteAbiResponse?.success === false && deleteAbiResponse.data !== null) {
      console.error("Failed to delete ABI:", deleteAbiResponse.error);
      toast.error(t("deleteAbiError", { message: deleteAbiResponse.error?.message || "Unknown error" }));
    }
  }, [deleteAbiResponse, t, refreshAbiList]);

  const handleNewABI = () => {
    setIsAddABIOpen(true);
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  // Define columns for TableComponent
  const columns = [
    {
      key: "name",
      header: t("abiName"),
      render: (row: ABIRow) => (
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleViewABI(row)}>
          <span>{row.name}</span>
        </div>
      ),
    },
    { key: "owner", header: t("addressUser") },
    {
      key: "created_at",
      header: t("addedTime"),
      render: (row: ABIRow) => formatDate(row.created_at),
    },
    {
      key: "type",
      header: t("abiType"),
      render: (row: ABIRow) => <span>{row.is_shared ? t("platformShared") : t("userImported")}</span>,
    },
    {
      key: "operations",
      header: t("operations"), // Operations column
      render: (row: ABIRow) => (
        <div className="relative flex items-center space-x-2">
          {!row.is_shared && (
            <>
              <button type="button" onClick={() => handleViewABI(row)} className="text-black hover:underline text-sm font-medium underline">
                {t("viewABI")}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleEllipsisMenu(row.id)}
                  className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="More options"
                  title="More options"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    ></path>
                  </svg>
                </button>
                {openDropdownId === row.id && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleDeleteABI(row)}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100 hover:text-red-700 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>{t("delete")}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout title={t("title")}>
      <div className="min-h-screen  ">
        <div className="mx-auto border border-gray-200 rounded-lg p-6 ">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader title={t("storedABI")} description={t("storedABIDescription")} />
            <button
              type="button"
              onClick={handleNewABI}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6"></path>
              </svg>
              <span>{t("new")}</span>
            </button>
          </div>
          <TableComponent<ABIRow>
            columns={columns}
            data={abis}
            showPagination={false} // Image does not show pagination for this table
            itemsPerPage={5} // Max 5 items visible in image
          />
        </div>
      </div>

      <AddABIForm isOpen={isAddABIOpen} onClose={() => setIsAddABIOpen(false)} onAddABI={handleAddABI} />
      <ViewABIForm
        isOpen={isViewABIOpen}
        onClose={() => setIsViewABIOpen(false)}
        viewAbiContent={viewAbiContent} // Pass the viewAbi
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDeleteABI}
        onConfirm={confirmDeleteABI}
        title="Delete ABI"
        description={`Are you sure you want to delete ABI "${abiToDelete?.name || ""}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageLayout>
  );
};

export default ABILibPage;
