"use client";

import React, { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AddTimelockContractSection from "./components/AddTimelockContractSection";
import TimelockContractTable from "./components/TimelockContractTable";
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from "@/store/userStore";
import type { TimelockContract } from "@/store/schema";

const Timelocks: React.FC = () => {
    const { data: timelockListResponse, request: fetchTimelockList, isLoading, error } = useApi();
    const { allTimelocks, setAllTimelocks } = useAuthStore();

    const refetchTimelocks = React.useCallback(() => {
        fetchTimelockList('/api/v1/timelock/list', {
            method: 'GET',
        });
    }, [fetchTimelockList]);

    useEffect(() => {
        refetchTimelocks();
    }, [refetchTimelocks]);

    useEffect(() => {
        if (timelockListResponse && timelockListResponse.success && timelockListResponse.data) {
            const compoundTimelocks: TimelockContract[] = timelockListResponse.data.compound_timelocks.map((timelock: TimelockContract): TimelockContract => ({
                ...timelock,
                standard: 'compound' as const
            }));
            const openzeppelinTimelocks: TimelockContract[] = timelockListResponse.data.openzeppelin_timelocks.map((timelock: TimelockContract): TimelockContract => ({
                ...timelock,
                standard: 'openzeppelin' as const
            }));
            const combinedTimelocks = [...compoundTimelocks, ...openzeppelinTimelocks];
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
            {hasTimelocks ? <TimelockContractTable data={allTimelocks} onDataUpdate={refetchTimelocks} /> : <AddTimelockContractSection />}
        </PageLayout>
    )
}

export default Timelocks;