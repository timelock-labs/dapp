"use client";

import React, { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AddTimelockContractSection from "./components/AddTimelockContractSection";
import TimelockContractTable from "./components/TimelockContractTable";
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from "@/store/userStore";


const Timelocks: React.FC = () => {
    const { data: timelockListResponse, request: fetchTimelockList, isLoading, error } = useApi();
    const params = useParams();
    const locale = params.locale;
    const { allTimelocks, setAllTimelocks } = useAuthStore();

    useEffect(() => {
        fetchTimelockList('/api/v1/timelock/list', {
            method: 'GET',
        });
    }, [fetchTimelockList]);

    useEffect(() => {
        if (timelockListResponse && timelockListResponse.success && timelockListResponse.data) {
            const combinedTimelocks = [...timelockListResponse.data.compound_timelocks, ...timelockListResponse.data.openzeppelin_timelocks];
            setAllTimelocks(combinedTimelocks);
        }
    }, [timelockListResponse, setAllTimelocks]);

    if (isLoading) {
        return <PageLayout title="Timelock">Loading...</PageLayout>;
    }

    if (error) {
        return <PageLayout title="Timelock">Error: {error.message}</PageLayout>;
    }

    const hasTimelocks = allTimelocks.length > 0;

    return (
        <PageLayout title="Timelock" >
            {hasTimelocks ? <TimelockContractTable data={allTimelocks} /> : <AddTimelockContractSection />}
        </PageLayout>
    )
}

export default Timelocks;