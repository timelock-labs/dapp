"use client";
import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import AddTimelockContractSection from './components/AddTimelockContractSection';
import TimelockContractTable, { CompoundTimelock, OpenZeppelinTimelock, TimelockRow } from './components/TimelockContractTable';

const TimelocksPage: React.FC = () => {
  const t = useTranslations("Timelocks");
  const [timelocks, setTimelocks] = useState<TimelockRow[]>([]);
  const [isAddTimelockOpen, setIsAddTimelockOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: timelockListResponse, request: fetchTimelockList, error } = useApi();
  const { request: acceptAdmin } = useApi();
  const { request: setPendingAdmin } = useApi();
  const { data: createTimelockResponse, request: createTimelock } = useApi();
  const { request: importTimelock } = useApi();
  const { request: updateRemark } = useApi();
  const { request: deleteTimelock } = useApi();
  const { request: getTimelockDetail } = useApi();
  const { request: checkAdminPermissions } = useApi();

  useEffect(() => {
    if (accessToken) {
      fetchTimelockList('/api/v1/timelock/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }, [accessToken, fetchTimelockList, createTimelockResponse]);

  useEffect(() => {
    if (timelockListResponse && timelockListResponse.success) {
      const allTimelocks: TimelockRow[] = [];
      if (timelockListResponse.data.compound_timelocks) {
        allTimelocks.push(...timelockListResponse.data.compound_timelocks.map((tl: CompoundTimelock) => ({ ...tl, standard: 'compound' })));
      }
      if (timelockListResponse.data.openzeppelin_timelocks) {
        allTimelocks.push(...timelockListResponse.data.openzeppelin_timelocks.map((tl: OpenZeppelinTimelock) => ({ ...tl, standard: 'openzeppelin' })));
      }
      setTimelocks(allTimelocks);
      toast.success(t('fetchTimelockListSuccess'));
    } else if (timelockListResponse && !timelockListResponse.success) {
      console.error('Failed to fetch Timelock list:', timelockListResponse.error);
      toast.error(t('fetchTimelockListError', { message: timelockListResponse.error?.message || 'Unknown error' }));
    }
  }, [timelockListResponse, t]);

  useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (createTimelockResponse && createTimelockResponse.success) {
      toast.success(t('createTimelockSuccess'));
      setIsAddTimelockOpen(false);
    } else if (createTimelockResponse && !createTimelockResponse.success) {
      toast.error(t('createTimelockError', { message: createTimelockResponse.error?.message || 'Unknown error' }));
    }
  }, [createTimelockResponse, t]);

  const handleViewDetail = async (row: TimelockRow) => {
    const standard = row.standard;
    await getTimelockDetail(`/api/v1/timelock/detail/${standard}/${row.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  };

  const handleUpdateRemark = async (row: TimelockRow, newRemark: string) => {
    const standard = row.standard;
    await updateRemark(`/api/v1/timelock/${standard}/${row.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        id: row.id,
        remark: newRemark,
        standard: standard,
      },
    });
  };

  const handleDeleteTimelock = async (row: TimelockRow) => {
    if (window.confirm(`Are you sure you want to delete Timelock: ${row.contract_address}?`)) {
      const standard = row.standard;
      await deleteTimelock(`/api/v1/timelock/${standard}/${row.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  };

  const handleAcceptAdmin = async (row: CompoundTimelock) => {
    await acceptAdmin(`/api/v1/timelock/compound/${row.id}/accept-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: {},
    });
  };

  const handleSetPendingAdmin = async (row: CompoundTimelock, newPendingAdmin: string) => {
    await setPendingAdmin(`/api/v1/timelock/compound/${row.id}/set-pending-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        id: row.id,
        new_pending_admin: newPendingAdmin,
      },
    });
  };

  const handleCreateTimelock = async (data: any) => {
    const createResponse = await createTimelock('/api/v1/timelock/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: data,
    });
  };

  const handleImportTimelock = async (data: any) => {
    await importTimelock('/api/v1/timelock/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: data,
    });
  };

  return (
    <PageLayout title={t('title')}>
      <div className="min-h-screen">
        <div className="mx-auto border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader
              title={t('managedTimelocks')}
              description={t('managedTimelocksDescription')}
            />
            <button
              onClick={() => setIsAddTimelockOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6"></path>
              </svg>
              <span>{t('newTimelock')}</span>
            </button>
          </div>

          <TimelockContractTable
            timelocks={timelocks}
            onViewDetail={handleViewDetail}
            onDeleteTimelock={handleDeleteTimelock}
          />
        </div>
      </div>

      <AddTimelockContractSection
        isOpen={isAddTimelockOpen}
        onClose={() => setIsAddTimelockOpen(false)}
        onAddTimelock={handleCreateTimelock}
      />
    </PageLayout>
  );
};

export default TimelocksPage;
