'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MilestoneItem } from '../action/getMilestonesReportData';
import { Icon } from '@/components/icons/Icon';

interface MilestonesReportClientProps {
  milestones: MilestoneItem[];
  error?: string;
}

// Helper to get a relevant icon based on milestone title keywords
const getMilestoneIcon = (title: string, iconString?: string) => {
  if (iconString) {
    return <span className="text-2xl mr-2 rtl:mr-0 rtl:ml-2">{iconString}</span>;
  }
  if (title.includes('طلب')) return <Icon name="ShoppingCart" size="lg" className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
  if (title.includes('عميل')) return <Icon name="Users" size="lg" className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
  if (title.includes('مبيعات')) return <Icon name="TrendingUp" size="lg" className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
  return <Icon name="Award" size="lg" className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
};

export default function MilestonesReportClient({
  milestones,
  error,
}: MilestonesReportClientProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-destructive-foreground">{error}</CardContent>
      </Card>
    );
  }

  if (!milestones || milestones.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          لا توجد إنجازات أو أهداف لعرضها حاليًا.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => (
        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3 pt-4 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {getMilestoneIcon(milestone.title, milestone.icon)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-card-foreground">{milestone.title}</CardTitle>
              {milestone.date && (
                <p className="text-xs text-muted-foreground">
                  {new Date(milestone.date).toLocaleDateString('ar-EG', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground">{milestone.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
