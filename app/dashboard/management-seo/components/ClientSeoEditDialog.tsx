// app/dashboard/seo/components/ClientSeoEditDialog.tsx
"use client";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateSeoEntry } from '../actions/updateSeoEntry';

export default function ClientSeoEditDialog({ item, type }: { item: { id: string; name: string; url: string }; type: 'metaTitle' | 'metaDescription' | 'schemaOrg' }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setInputValue('');
    setOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    await updateSeoEntry(item.id, { [type]: inputValue });
    setLoading(false);
    setOpen(false);
    setInputValue('');
    if (typeof window !== 'undefined') window.location.reload();
  };

  return (
    <>
      <Button size="sm" variant="outline" className="ml-auto" onClick={handleOpen}>تعديل</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل {type === 'metaTitle' ? 'عنوان Meta' : type === 'metaDescription' ? 'وصف Meta' : 'Schema.org'}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {type === 'schemaOrg' ? (
              <textarea
                className="w-full min-h-[120px] border rounded p-2"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="أدخل بيانات Schema.org (JSON-LD) هنا"
              />
            ) : (
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={type === 'metaTitle' ? 'أدخل عنوانًا واضحًا وجذابًا' : 'أدخل وصفًا مختصرًا وجذابًا'}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
