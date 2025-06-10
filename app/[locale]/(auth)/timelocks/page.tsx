import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import AddTimelockContractSection from "./components/AddTimelockContractSection";
import TimelockContractTable from "./components/TimelockContractTable";
import ImportTimelockForm from "./components/ImportTimelockForm";
import CreateTimelockPage from './components/TimelockCreation/CreateTimelockPage'

import {useTranslations} from 'next-intl'


const Timelocks: React.FC = () => {
const t=useTranslations('Timelocks')

    return (<PageLayout title={t('title')} >
        {/* <AddTimelockContractSection /> */}
        <TimelockContractTable />
        {/* <ImportTimelockForm /> */}
        {/* <CreateTimelockPage/> */}
    </PageLayout>

    )
}

export default Timelocks;