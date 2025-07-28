"use client"; // Required for useState and event handlers

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming TextInput is a wrapper around Input or similar
import { Label } from "@/components/ui/label"; // Assuming you have a Label component or use Shadcn/ui Label
import ABITextarea from "@/components/ui/ABITextarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AddABIFormProps {
  isOpen: boolean;
  onClose: () => void;
  viewAbiContent: any;
}

const AddABIForm: React.FC<AddABIFormProps> = ({ isOpen, onClose, viewAbiContent }) => {
  const t = useTranslations("Transactions.AddABIForm");

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[558px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>View ABI Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden">
          <div className="space-y-2">
            <Label>{t("nameLabel")}</Label>
            <Input defaultValue={viewAbiContent.name} />
          </div>
          <div className="space-y-2">
            <Label>{t("descriptionLabel")}</Label>
            <Textarea defaultValue={viewAbiContent.description} />
          </div>
          <div className="space-y-2">
            <Label>Interface Details</Label>
            <Textarea className="h-[300px]" defaultValue={JSON.stringify(JSON.parse(viewAbiContent.abi_content), null, 2)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              {t("cancelButton")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddABIForm;
