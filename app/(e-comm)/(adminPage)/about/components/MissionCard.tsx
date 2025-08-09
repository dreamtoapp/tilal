import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

type MissionCardProps = {
    title: string;
    text: string;
};

const MissionCard = ({ title, text }: MissionCardProps) => (
    <section className='mb-16 animate-fade-in-up' style={{ animationDelay: '200ms' }}>
        <Card className="shadow-xl border-l-4 border-feature-suppliers card-hover-effect card-border-glow text-center bg-gradient-to-br from-feature-suppliers/10 to-background/80 backdrop-blur-md rounded-2xl p-6 md:p-10">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                    <Heart className="h-10 w-10 text-feature-suppliers icon-enhanced drop-shadow-lg" />
                    <span className="font-arabic">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-md md:text-lg text-muted-foreground max-w-2xl mx-auto font-arabic mt-2'>
                    {text}
                </p>
            </CardContent>
        </Card>
    </section>
);

export default MissionCard; 