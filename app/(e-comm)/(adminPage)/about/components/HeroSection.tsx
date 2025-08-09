import Image from 'next/image';

type HeroSectionProps = {
    title: string;
    subtitle: string;
    imageUrl?: string;
};

const HeroSection = ({ title, subtitle, imageUrl }: HeroSectionProps) => (
    <section className="relative flex flex-col items-center justify-center mb-20 mt-10">
        {imageUrl && imageUrl.trim() !== '' && (
            <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/7' }}>
                <Image
                    src={imageUrl?.includes('unsplash.com') ? `${imageUrl}&w=900&q=80` : imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    style={{ minHeight: 220 }}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-arabic">
                        {title}
                    </h1>
                    <p className="text-lg md:text-2xl font-medium font-arabic max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>
            </div>
        )}
        {/* If no image, show text only */}
        {!imageUrl && (
            <div className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-arabic">{title}</h1>
                <p className="text-lg md:text-2xl font-medium font-arabic max-w-2xl mx-auto">{subtitle}</p>
            </div>
        )}
    </section>
);

export default HeroSection; 