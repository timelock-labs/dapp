import AddChannelCard from "./components/AddChannelCard";
import AddChannelModal from "./components/AddChannelModal";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";
import ChannelCard from "./components/ChannelCard";

export default function Channel() {
    const t = useTranslations('Notify.channel');
    const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
    const [channels, setChannels] = useState<Array<{ id: string; type: string; remark?: string; created_at: string; }>>([]);

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


    const handleDeleteMailbox = (id: string) => {
        setChannels(channels.filter(channel => channel.id !== id));
    };
    const handleEditMailbox = (channel: { id: string; type: string; remark?: string; created_at: string }) => {
        setChannels(channels.map(c => (c.id === channel.id ? channel : c)));
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
                        id={channel.id}
                        type={channel.type}
                        remark={channel.remark}
                        created_at={channel.created_at}
                    />
                ))}
                <AddChannelCard onClick={() => setIsAddChannelModalOpen(true)} />
            </div>
            <AddChannelModal isOpen={isAddChannelModalOpen} onClose={() => setIsAddChannelModalOpen(false)} onSuccess={() => setIsAddChannelModalOpen(false)} />
        </div>
    );
}