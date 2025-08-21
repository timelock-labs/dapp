import CannelCard from "./components/CannelCard";
import AddCannelModal from "./components/AddCannelModal";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";

export default function Channel() {
    const t = useTranslations('Notify.channel');
    const [isAddCannelModalOpen, setIsAddCannelModalOpen] = useState(false);

    return (
        <div>
            <div className='flex-grow'>
                <SectionHeader title={t('title')} description={t('description')} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <CannelCard onClick={() => setIsAddCannelModalOpen(true)} />
            </div>
            <AddCannelModal isOpen={isAddCannelModalOpen} onClose={() => setIsAddCannelModalOpen(false)} onSuccess={() => setIsAddCannelModalOpen(false)} />
        </div>
    );
}