import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

function LogoutDialog({
                        open,
                        onOpenChange,
                        onConfirm,
                        title = "Log Out",
                        description = "Are you sure you want to log out?",
                        confirmText = "Confirm",
                        cancelText = "Cancel",
                      }: LogoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <div className={'flex justify-center'}>
            <Image
              src={'/Icons/door.svg'}
              alt={'icon'}
              width={70}
              height={70}
              priority
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-md text-muted-foreground font-semibold">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-5 w-full">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-100 flex-1 text-primary font-semibold text-md"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-primary text-white hover:bg-red-700 flex-1 font-semibold text-md"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutDialog;
