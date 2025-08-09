import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LoginPromptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message?: string;
}

export default function LoginPromptModal({ open, onOpenChange, message }: LoginPromptModalProps) {
    const router = useRouter();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent dir="rtl" className="max-w-sm rounded-2xl shadow-2xl text-center p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">يرجى تسجيل الدخول أو إنشاء حساب جديد</DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground mb-6">
                        {message || 'للاستفادة من هذه الميزة، يرجى تسجيل الدخول أو إنشاء حساب جديد.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="h-px w-full bg-border mb-6" />
                <div className="flex flex-col gap-4">
                    <Button
                        variant="default"
                        className="w-full text-lg py-3 shadow-md focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="تسجيل الدخول"
                        onClick={() => router.push('/auth/login')}
                    >
                        تسجيل الدخول
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full text-lg py-3 border-2 border-primary/40 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="إنشاء حساب جديد"
                        onClick={() => router.push('/auth/register')}
                    >
                        إنشاء حساب جديد
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 