import React from "react";
import PageLayout from "@/components/layout/PageLayout";
// import AddTimelockContractSection from "./components/AddTimelockContractSection";
// import ImportTimelockForm from "./components/ImportTimelockForm";
// import CreateTimelockPage from './components/TimelockCreation/CreateTimelockPage'
import SectionHeader from '@/components/ui/SectionHeader'; // Reusing SectionHeader

import {useTranslations} from 'next-intl'


const Timelocks: React.FC = () => {
    const t=useTranslations('Timelocks')

    return (
        <PageLayout title={t('title')} >
            {/* <AddTimelockContractSection /> */}
            {/* <ImportTimelockForm /> */}
            {/* <CreateTimelockPage/> */}
             <div className="bg-white "> {/* Wrapper with a light gray background */}
                <div className="mx-auto"> {/* Max width container to center content */}
                    {/* Header and Buttons Section - All in one row */}
                    <div className="flex items-center mb-6"> {/*  items-center for vertical alignment */}
                        {/* Left Side: Section Header */}
                        <div className="flex-grow"> {/* Use flex-grow to take up remaining space */}
                            <SectionHeader
                                title="添加Timelock 合约"
                                description="Manage or upgrade your plan."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default Timelocks;