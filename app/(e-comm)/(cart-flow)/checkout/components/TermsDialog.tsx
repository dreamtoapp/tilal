// components/Checkout/TermsDialog.tsx
'use client';
import { type JSX } from 'react';
import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Info, Shield, Truck, Undo } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for props
export interface Policy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  isPublished: boolean;
  version: number;
}

interface TermsDialogContentProps {
  policies: Policy[];
  loading: boolean;
  error: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getPolicyIcon: (title: string) => JSX.Element;
  getPolicySummary: (title: string) => string;
  extractKeyPoints: (content: string) => string[];
}

export function TermsDialogContent({ policies, loading, getPolicyIcon, getPolicySummary, extractKeyPoints }: TermsDialogContentProps) {
  return (
    <div>
      <div className="flex flex-row-reverse items-center justify-between gap-x-2 mb-4">
        <DialogTitle className="truncate text-lg font-bold">الشروط والأحكام وسياسة الخصوصية</DialogTitle>
      </div>
      <ScrollArea className="h-[60vh] pr-2 mt-4">
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <Alert dir="rtl">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <AlertDescription className="break-words text-right">
                  هذا ملخص سريع للشروط المهمة. يمكنك الاطلاع على التفاصيل الكاملة في تبويب &quot;التفاصيل الكاملة&quot;
                </AlertDescription>
              </Alert>
              <div className="grid gap-4">
                {policies.map((policy: Policy) => (
                  <Card key={policy.id} className="border-r-4 border-r-feature-commerce" dir="rtl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base text-primary flex-wrap text-right">
                        <div className="flex-shrink-0">{getPolicyIcon(policy.title)}</div>
                        <span className="break-words text-muted-foreground">{policy.title}</span>
                        <Badge variant="outline" className="text-xs font-medium flex-shrink-0">
                          الإصدار {policy.version}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-foreground mb-3 break-words text-right">
                        {getPolicySummary(policy.title)}
                      </p>
                      <div className="space-y-2">
                        {extractKeyPoints(policy.content).map((point: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-foreground">
                            <div className="w-1.5 h-1.5 bg-feature-commerce rounded-full mt-2 flex-shrink-0" />
                            <span className="break-words text-right">{point}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>



            </>
          )}
        </div>
        <Card className="bg-muted border-muted" dir="rtl">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-warning/20 rounded-full flex-shrink-0">
                <Info className="h-4 w-4 text-warning" />
              </div>
              <div className="space-y-2 min-w-0 flex-1">
                <h4 className="font-medium text-sm text-primary text-right">معلومات مهمة</h4>
                <div className="text-sm text-foreground space-y-1">
                  <p className="break-words text-right">• استخدامك للموقع يعني موافقتك على جميع الشروط</p>
                  <p className="break-words text-right">• يمكنك التواصل معنا للاستفسار عن أي بند</p>
                  <p className="break-words text-right">• الشروط قابلة للتحديث وسيتم إشعارك بالتغييرات</p>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollArea >
      <div className="flex flex-wrap gap-4 justify-center items-center border-t pt-4 mt-4 px-4 bg-background">
        <span className="text-sm text-muted-foreground">روابط السياسات:</span>
        <Link href="/policies/website" className="text-feature-commerce font-semibold hover:underline text-sm">شروط الموقع</Link>
        <Link href="/policies/privacy" className="text-feature-commerce font-semibold hover:underline text-sm">سياسة الخصوصية</Link>
        <Link href="/policies/return" className="text-feature-commerce font-semibold hover:underline text-sm">سياسة الإرجاع</Link>
        <Link href="/policies/shipping" className="text-feature-commerce font-semibold hover:underline text-sm">سياسة الشحن</Link>
      </div>
    </div >
  );
}

const POLICY_ICONS = {
  'سياسة الموقع': FileText,
  'سياسة الخصوصية': Shield,
  'سياسة الإرجاع': Undo,
  'سياسة الشحن': Truck,
};

const POLICY_SUMMARIES = {
  'سياسة الموقع': 'شروط استخدام الموقع وحقوق الملكية الفكرية',
  'سياسة الخصوصية': 'كيفية جمع وحماية بياناتك الشخصية',
  'سياسة الإرجاع': 'شروط إرجاع المنتجات واسترداد المبالغ',
  'سياسة الشحن': 'خدمات التوصيل والرسوم والأوقات',
};

export default function TermsDialog({ hideTrigger = false }: { hideTrigger?: boolean }) {
  const [open, setOpen] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchPolicies = async () => {
      if (open && policies.length === 0) {
        try {
          setLoading(true);
          setError('');

          // Fetch all published policies
          const [websitePolicy, privacyPolicy, returnPolicy, shippingPolicy] = await Promise.allSettled([
            fetch('/api/policies/website').then(res => res.json()),
            fetch('/api/policies/privacy').then(res => res.json()),
            fetch('/api/policies/return').then(res => res.json()),
            fetch('/api/policies/shipping').then(res => res.json())
          ]);

          const activePolicies: Policy[] = [];

          if (websitePolicy.status === 'fulfilled' && websitePolicy.value.isPublished) {
            activePolicies.push(websitePolicy.value);
          }
          if (privacyPolicy.status === 'fulfilled' && privacyPolicy.value.isPublished) {
            activePolicies.push(privacyPolicy.value);
          }
          if (returnPolicy.status === 'fulfilled' && returnPolicy.value.isPublished) {
            activePolicies.push(returnPolicy.value);
          }
          if (shippingPolicy.status === 'fulfilled' && shippingPolicy.value.isPublished) {
            activePolicies.push(shippingPolicy.value);
          }

          setPolicies(activePolicies);
        } catch (err) {
          console.error('Error fetching policies:', err);
          setError('فشل تحميل الشروط والأحكام. يرجى المحاولة لاحقاً');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPolicies();
  }, [open, policies.length]);

  const getPolicyIcon = (title: string) => {
    const IconComponent = POLICY_ICONS[title as keyof typeof POLICY_ICONS] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getPolicySummary = (title: string) => {
    return POLICY_SUMMARIES[title as keyof typeof POLICY_SUMMARIES] || 'سياسة عامة';
  };

  const extractKeyPoints = (content: string) => {
    const lines = content.split('\n');
    const keyPoints = lines
      .filter(line => {
        const match = line.trim().startsWith('[*]');
        return match;
      })
      .slice(0, 5)
      .map(point => point.replace(/^\[\*\]\s*/, '').trim());
    return keyPoints;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="p-0 h-auto text-feature-commerce hover:text-feature-commerce/80 underline"
          >
            <FileText className="h-3 w-3 ml-1" />
            الشروط والأحكام
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] max-w-4xl" dir="rtl">
        <TermsDialogContent
          policies={policies}
          loading={loading}
          error={error}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getPolicyIcon={getPolicyIcon}
          getPolicySummary={getPolicySummary}
          extractKeyPoints={extractKeyPoints}
        />
      </DialogContent>
    </Dialog>
  );
}
