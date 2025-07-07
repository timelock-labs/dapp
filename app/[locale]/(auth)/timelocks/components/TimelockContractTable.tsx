import React from 'react';
import { useTranslations } from 'next-intl';
import TableComponent from '@/components/ui/TableComponent';

interface CompoundTimelock {
  admin: string;
  can_accept_admin: boolean;
  can_set_pending_admin: boolean;
  chain_id: number;
  chain_name: string;
  contract_address: string;
  created_at: string;
  creator_address: string;
  emergency_mode: boolean;
  id: number;
  is_imported: boolean;
  min_delay: number;
  pending_admin: string;
  remark: string;
  status: string;
  tx_hash: string;
  updated_at: string;
  user_permissions: string[];
  standard: 'compound';
}

interface OpenZeppelinTimelock {
  cancellers: string;
  cancellers_list: string[];
  chain_id: number;
  chain_name: string;
  contract_address: string;
  created_at: string;
  creator_address: string;
  emergency_mode: boolean;
  executors: string;
  executors_list: string[];
  id: number;
  is_imported: boolean;
  min_delay: number;
  proposers: string;
  proposers_list: string[];
  remark: string;
  status: string;
  tx_hash: string;
  updated_at: string;
  user_permissions: string[];
  standard: 'openzeppelin';
}

type TimelockRow = CompoundTimelock | OpenZeppelinTimelock;

interface TimelockContractTableProps {
  timelocks: TimelockRow[];
  onViewDetail: (row: TimelockRow) => void;
  onDeleteTimelock: (row: TimelockRow) => void;
}

const TimelockContractTable: React.FC<TimelockContractTableProps> = ({
  timelocks,
  onViewDetail,
  onDeleteTimelock,
}) => {
  const t = useTranslations("Timelocks");

  const columns = [
    { key: 'contract_address', header: t('contractAddress') },
    { key: 'chain_name', header: t('chain') },
    {
      key: 'standard',
      header: t('standard'),
      render: (row: TimelockRow) => (
        <span>{row.standard}</span>
      ),
    },
    { key: 'status', header: t('status') },
    { key: 'remark', header: t('remark') },
    { key: 'created_at', header: t('createdAt') },
    {
      key: 'operations',
      header: t('operations'),
      render: (row: TimelockRow) => (
        <div className="relative flex items-center space-x-2">
          <button
            onClick={() => onViewDetail(row)}
            className="text-black hover:underline text-sm font-medium underline"
          >
            {t('viewDetail')}
          </button>
          <button
            onClick={() => onDeleteTimelock(row)}
            className="text-red-600 hover:underline text-sm font-medium underline"
          >
            {t('delete')}
          </button>
        </div>
      ),
    },
  ];

  return (
    <TableComponent<TimelockRow>
      columns={columns}
      data={timelocks}
      showPagination={false}
      itemsPerPage={10}
    />
  );
};

export default TimelockContractTable;
