import CannelCard from "./components/CannelCard";
import AddCannelModal from "./components/AddCannelModal";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";
import ChannelCard from "./components/ChannelCard";
import { useApi } from "@/hooks/useApi";

export default function Channel() {
    const t = useTranslations('Notify.channel');
    const [isAddCannelModalOpen, setIsAddCannelModalOpen] = useState(false);
    const [channels, setChannels] = useState<Array<{ id: string; type: string; remark?: string; created_at: string; }>>([]);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ isOpen: boolean; type: string; id: number }>({ isOpen: false, type: '', id: 0 });
    const { request: deleteChannel } = useApi();

    useEffect(() => {
        setChannels([
            {
                id: '1',
                type: 'feishu',
                remark: '安全部门飞书群',
                created_at: '2025-08-21',

            },
        ]);
    }, []);


    const handleDeleteMailbox = (id: number, type: string) => {
        setChannels(channels.filter(channel => channel.id !== id));
    };
    const handleEditMailbox = (channel: { id: string; type: string; remark?: string; created_at: string }) => {
        setChannels(channels.map(channel => (channel.id === channel.id ? channel : channel)));
    };

    return (
        <div>
            <div className='flex-grow'>
                <SectionHeader title={t('title')} description={t('description')} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {channels.map(channel => (
                    <ChannelCard
                        onDelete={handleDeleteMailbox}
                        onEdit={handleEditMailbox}
                        key={channel.id}
                        id={parseInt(channel.id)}
                        type={channel.type}
                        remark={channel.remark}
                        created_at={channel.created_at}
                    />
                ))}
                <CannelCard onClick={() => setIsAddCannelModalOpen(true)} />
            </div>
            <AddCannelModal isOpen={isAddCannelModalOpen} onClose={() => setIsAddCannelModalOpen(false)} onSuccess={() => setIsAddCannelModalOpen(false)} />
        </div>
    );
}