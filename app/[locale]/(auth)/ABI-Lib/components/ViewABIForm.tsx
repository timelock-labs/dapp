'use client'; // Required for useState and event handlers

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming TextInput is a wrapper around Input or similar
import { Label } from '@/components/ui/label'; // Assuming you have a Label component or use Shadcn/ui Label
import ABITextarea from '@/components/ui/ABITextarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface AddABIFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddABI: (name: string, description: string, abi: string) => void;
}

const AddABIForm: React.FC<AddABIFormProps> = ({ isOpen, onClose, onAddABI }) => {
  const t = useTranslations('Transactions.AddABIForm');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [abi, setAbi] = useState<string>('');

  const handleCancel = () => {
    console.log('Cancel button clicked');
    setName(''); // Reset form fields
    setDescription('');
    setAbi('');
    onClose(); // Close the dialog
  };

  const handleSave = () => {
    console.log('Save button clicked');
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('ABI:', abi);
    // Here you would typically send data to a backend or update global state
    if (name.trim() && description.trim() && abi.trim()) {
      onAddABI(name, description, abi);
      setName('');
      setDescription('');
      setAbi('');
      onClose(); // Close the dialog after saving
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[558px] h-[470px] overflow-hidden"> {/* Added overflow-hidden */}
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden">
          {/* Name Input Field - Vertical Layout */}
          <div className="space-y-2">
            <Label htmlFor="abiName">
              {t('nameLabel')}
            </Label>
            <Input id="abiName" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('nameLabel')} />
          </div>
          {/* Description Input Field - Vertical Layout */}
          <div className="space-y-2">
            <Label htmlFor="abiDescription">
              {t('descriptionLabel')}
            </Label>
            <Input id="abiDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('descriptionLabel')} />
          </div>
          <ABITextarea
            id="abiContent"
            label={t('contentLabel')}
            value={abi}
            onChange={setAbi}
            placeholder={t('contentLabel')}
            rows={5}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>{t('cancelButton')}</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>{t('addButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddABIForm;