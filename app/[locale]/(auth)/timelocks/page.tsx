import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import AddTimelockContractSection from "./components/AddTimelockContractSection";
import TimelockContractTable from "./components/TimelockContractTable";

import {useTranslations} from 'next-intl'


const Timelocks: React.FC = () => {
const t=useTranslations('Timelocks')

    return (<PageLayout title={t('title')} >
        {/* <AddTimelockContractSection /> */}
        <TimelockContractTable />
    </PageLayout>

    )
}

export default Timelocks;