import Link from '@/components/link';
import { Button } from '@/components/ui/button';

type CallToActionSectionProps = {
    title: string;
    text: string;
    buttonText: string;
    buttonLink: string;
    secondaryActionText?: string;
    secondaryActionLink?: string;
};

const CallToActionSection = ({ title, text, buttonText, buttonLink, secondaryActionText = 'تواصل معنا', secondaryActionLink = '/contact' }: CallToActionSectionProps) => (
    <section className="animate-fade-in-up py-16" style={{ animationDelay: '800ms' }}>
        <div className="bg-gradient-to-r from-feature-suppliers to-feature-commerce text-primary-foreground rounded-2xl p-10 md:p-16 text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 font-arabic">{title}</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto font-arabic">{text}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={buttonLink}>
                    <Button
                        size="lg"
                        className="bg-white text-feature-suppliers font-bold px-10 py-4 text-xl rounded-full shadow-lg hover:bg-feature-suppliers hover:text-white transform hover:scale-105 transition-all duration-200 border-2 border-feature-suppliers"
                    >
                        {buttonText}
                    </Button>
                </Link>
                <Link href={secondaryActionLink}>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-white text-white font-bold px-8 py-4 text-lg rounded-full hover:bg-white/10 hover:text-feature-suppliers transition-all duration-200"
                    >
                        {secondaryActionText}
                    </Button>
                </Link>
            </div>
        </div>
    </section>
);

export default CallToActionSection; 