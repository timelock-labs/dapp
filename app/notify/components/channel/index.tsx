import AddChannelCard from "./components/AddChannelCard";
import AddChannelModal from "./components/AddChannelModal";
import { useEffect, useState, useCallback } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";
import ChannelCard from "./components/ChannelCard";
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Channel {
    "created_at": string,
    "id": string,
    "is_active": boolean,
    "name": string,
    "secret": string,
    "updated_at": string,
    "user_address": string,
    "webhook_url": string,
    "channel": string
}

export default function Channel() {
    const t = useTranslations('Notify.channel');
    const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { request: deleteChannelApi } = useApi();
    const { request: getChannelsApi } = useApi();

    // 获取频道列表
    const fetchChannels = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getChannelsApi('/api/v1/notifications/configs');
            if (response && response.data) {
                const data = [response.data.feishu_configs.map((item: Channel)=>({
                    ...item,
                    channel:'feishu'
                })), response.data.lark_configs.map((item: Channel)=>({
                    ...item,
                    channel:'lark'
                })), response.data.telegram_configs.map((item: Channel)=>({
                    ...item,
                    channel:'telegram'
                }))]
                setChannels(data.flat());
            }
        } catch (error) {
            console.error('Failed to fetch channels:', error);

        } finally {
            setIsLoading(false);
        }
    }, [getChannelsApi]);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);


    // 删除频道
    const handleDeleteChannel = async (id: string | number) => {
        const channel = channels.filter(channel => channel.id !== id)[0] as Channel
        try {
            await deleteChannelApi(`/api/v1/notifications/delete`, {
                channel: channel.channel,
                name: channel.name
            });
            setChannels(channels.filter(channel => channel.id !== id));
            toast.success(t('channelDeletedSuccessfully'));
        } catch (error) {
            console.error('Failed to delete channel:', error);
            toast.error(t('deleteChannelError'));
        }
    };

    // 编辑频道
    const handleEditChannel = (channel: Channel) => {
        setChannels(channels.map(c => (c.id === channel.id ? channel : c)));
    };

    // 添加频道成功后的回调
    const handleAddChannelSuccess = () => {
        setIsAddChannelModalOpen(false);
        fetchChannels(); // 重新获取频道列表
    };

    return (
        <div>
            <div className='flex-grow'>
                <SectionHeader title={t('title')} description={t('description')} />
            </div>
            {isLoading ? (
                <div className='flex justify-center items-center py-8'>
                    <div className='text-gray-500'>{t('loading')}</div>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {channels.map(channel => (
                        <ChannelCard
                            onDelete={handleDeleteChannel}
                            onEdit={handleEditChannel}
                            key={channel.id}
                            channelData={channel}
                        />
                    ))}
                    <AddChannelCard onClick={() => setIsAddChannelModalOpen(true)} />
                </div>
            )}
            <AddChannelModal
                isOpen={isAddChannelModalOpen}
                onClose={() => setIsAddChannelModalOpen(false)}
                onSuccess={handleAddChannelSuccess}
            />
        </div>
    );
}