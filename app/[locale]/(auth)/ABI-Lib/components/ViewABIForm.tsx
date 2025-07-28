"use client"; // Required for useState and event handlers

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming TextInput is a wrapper around Input or similar
import { Label } from "@/components/ui/label"; // Assuming you have a Label component or use Shadcn/ui Label
import ABITextarea from "@/components/ui/ABITextarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface AddABIFormProps {
  isOpen: boolean;
  onClose: () => void;
  // viewAbiContent:{
  //   name: string;
  //   description: string;
  //   abi_content: any[];
  // }
    viewAbiContent:any
}

const AddABIForm: React.FC<AddABIFormProps> = ({ isOpen, onClose, viewAbiContent }) => {
  const t = useTranslations("Transactions.AddABIForm");

  if (!isOpen) {
    return null;
  }

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>

      <DialogContent className="w-[558px] h-[470px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>View</DialogTitle>
          <DialogDescription>View ABI Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden">
          <div className="space-y-2">
            <Label htmlFor="abiName">{t("nameLabel")}</Label>
            <Input id="abiName" value={viewAbiContent.name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abiDescription">{t("descriptionLabel")}</Label>
            <Input id="abiDescription" value={viewAbiContent.description}  disabled/>
          </div>
          <ABITextarea id="abiContent" label={t("contentLabel")} value={JSON.stringify(viewAbiContent.abi_content,null,2)} rows={5}  disabled/>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t("cancelButton")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddABIForm;
