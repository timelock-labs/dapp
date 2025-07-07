"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface AddTimelockContractSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTimelock: (data: any) => void; // Placeholder for actual data type
}

const AddTimelockContractSection: React.FC<AddTimelockContractSectionProps> = ({ isOpen, onClose, onAddTimelock }) => {
  const t = useTranslations("Timelocks");
  const [contractAddress, setContractAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [standard, setStandard] = useState('');
  const [remark, setRemark] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!contractAddress || !chainId || !standard) {
      alert('Please fill in all required fields.');
      return;
    }
    onAddTimelock({
      contract_address: contractAddress,
      chain_id: parseInt(chainId),
      standard,
      remark,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('newTimelock')}</DialogTitle>
          <DialogDescription>
            {t('managedTimelocksDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractAddress" className="text-right">
              {t('contractAddress')}
            </Label>
            <Input
              id="contractAddress"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chainId" className="text-right">
              {t('chain')}
            </Label>
            <Input
              id="chainId"
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="standard" className="text-right">
              {t('standard')}
            </Label>
            <Input
              id="standard"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="col-span-3"
              placeholder="compound or openzeppelin"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              {t('remark')}
            </Label>
            <Input
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit}>{t('add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimelockContractSection;
