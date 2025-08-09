import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';

const iconMap: Record<string, string> = {
    star: 'Star',
    truck: 'Truck',
    mapPin: 'MapPin',
    droplet: 'Droplet',
    shieldCheck: 'ShieldCheck',
    award: 'Award',
    // Add more as needed
};

interface Feature {
    icon: string; // now a string from the DB
    title: string;
    description: string;
    imageUrl?: string;
}

const WhyChooseUsSection = ({ features }: { features: Feature[] }) => (
    <section className='mb-20 animate-fade-in-up bg-gradient-to-b from-background/80 to-feature-suppliers/5 py-12 rounded-2xl shadow-inner'>
        <h2 className='text-3xl font-bold text-center mb-10 font-arabic'>لماذا تختار أمواج؟</h2>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, index) => {
                const iconName = iconMap[feature.icon] || 'Star';
                return (
                    <Card
                        key={index}
                        className="shadow-lg border-t-4 border-feature-suppliers card-hover-effect card-border-glow text-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl bg-background/80 rounded-xl overflow-hidden flex flex-col"
                    >
                        {/* Image at the top, fills width */}
                        {feature.imageUrl ? (
                            <div className="relative w-full h-44">
                                <Image
                                    src={feature.imageUrl}
                                    alt={feature.title}
                                    fill
                                    className="object-cover w-full h-full rounded-t-xl"
                                    loading="lazy"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-44 bg-feature-suppliers-soft">
                                <Icon name={iconName} size="xl" variant="accent" className="icon-enhanced" />
                            </div>
                        )}
                        <CardHeader className="items-center pt-4 pb-2">
                            <h3 className='text-xl font-semibold text-foreground mb-2 font-arabic'>{feature.title}</h3>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-center pb-6">
                            <p className='text-muted-foreground text-sm font-arabic'>{feature.description}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    </section>
);

export default WhyChooseUsSection; 