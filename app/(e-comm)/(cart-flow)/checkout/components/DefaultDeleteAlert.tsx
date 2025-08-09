"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface DefaultDeleteAlertProps {
    onConfirm: () => void;
}

export default function DefaultDeleteAlert({ onConfirm }: DefaultDeleteAlertProps) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <span className="flex items-center gap-2 text-lg text-destructive font-bold">
                            <AlertTriangle className="h-5 w-5 text-destructive icon-enhanced" />
                            لا يمكن حذف العنوان الافتراضي
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className="text-sm mt-2 text-destructive">
                    لا يمكن حذف العنوان الافتراضي. عيّن عنوانًا آخر كافتراضي أولاً.
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={() => { setOpen(false); onConfirm(); }}>موافق</button>
                    <button onClick={() => setOpen(false)}>إلغاء</button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 