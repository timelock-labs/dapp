"use client";

import React, { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AddTimelockContractSection from "./components/AddTimelockContractSection";
import TimelockContractTable from "./components/TimelockContractTable";
import ImportTimelockForm from "./components/ImportTimelockForm";
import CreateTimelockPage from './components/TimelockCreation/CreateTimelockPage'
import { useApi } from '@/hooks/useApi';


const Timelocks: React.FC = () => {
    const { data: timelockListResponse, request: fetchTimelockList, isLoading, error } = useApi();

    useEffect(() => {
        fetchTimelockList('/api/v1/timelock/list', {
            method: 'GET',
        });
    }, [fetchTimelockList]);

    if (isLoading) {
        return <PageLayout title="Timelock">Loading...</PageLayout>;
    }

    if (error) {
        return <PageLayout title="Timelock">Error: {error.message}</PageLayout>;
    }

    const hasTimelocks = timelockListResponse && timelockListResponse.success && timelockListResponse.data && timelockListResponse.data.length > 0;

    return (
        <PageLayout title="Timelock" >
            {hasTimelocks ? <TimelockContractTable /> : <AddTimelockContractSection />}
            {/* <ImportTimelockForm />
            <CreateTimelockPage/> */}
        </PageLayout>
    )
}

export default Timelocks;

// 没有的话显示12，有的话显示5
// 倒入是6， 创建是7 ，
// 交易是4。点发起交易跳转到8