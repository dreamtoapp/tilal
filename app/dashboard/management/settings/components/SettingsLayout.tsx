import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface SettingsLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
    progress?: {
        current: number;
        total: number;
        isComplete: boolean;
    };
}

export default function SettingsLayout({
    children,
    title,
    description,
    icon: Icon = Settings,
    progress
}: SettingsLayoutProps) {
    return (
        <div className="container mx-auto bg-background p-6 text-foreground" dir="rtl">

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            {progress && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">تقدم هذا القسم</span>
                        <span className="text-sm text-muted-foreground">
                            {progress.current} من {progress.total} مكتمل
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${progress.isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
} 