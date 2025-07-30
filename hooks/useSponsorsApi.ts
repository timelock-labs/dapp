"use client";

import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";

export interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  link: string;
  sort_order: number;
  type: string;
}

export interface SponsorsData {
  sponsors: Partner[];
  partners: Partner[];
}

export interface SponsorsApiResponse {
  data?: SponsorsData;
  error?: {
    code: string;
    details: string;
    message: string;
  };
  success: boolean;
}

export const useSponsorsApi = () => {
  const { request } = useApi();

  const getSponsors = useCallback(async (): Promise<SponsorsApiResponse> => {
    try {
      const response = await request("/api/v1/sponsors/public", {
        method: "GET",
      });

      return response;
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      throw error;
    }
  }, [request]);

  return {
    getSponsors,
  };
};
