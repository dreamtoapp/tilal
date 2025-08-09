import HeroSection from './components/HeroSection';
import MissionCard from './components/MissionCard';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CallToActionSection from './components/CallToActionSection';
import { getAboutPageContent } from './actions/getAboutPageContent';
import FAQSection from './components/FAQSection';

// SEO metadata for the About page
export const metadata = {
  title: 'عن أمواج | مياه نقية لحياة صحية',
  description: 'تعرف على قصة أمواج، رسالتنا، قيمنا، ولماذا يثق بنا آلاف العملاء في المملكة.',
};

const AboutPage = async () => {
  const aboutPage = await getAboutPageContent();
  if (!aboutPage) return <div>لا يوجد محتوى لصفحة من نحن حالياً.</div>;

  return (
    <main className='container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
      {/* FAQPage structured data for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': aboutPage.faq.map((item: any) => ({
              '@type': 'Question',
              'name': item.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer,
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <section className="rounded-2xl bg-background/90 shadow-md mb-12" aria-labelledby="about-hero-title">
        <HeroSection
          title={aboutPage.heroTitle}
          subtitle={aboutPage.heroSubtitle}
          imageUrl={aboutPage.heroImageUrl}
        />
      </section>
      {/* Mission Section */}
      <section className="rounded-2xl bg-feature-suppliers/5 shadow-inner mb-12 py-8 px-2" aria-labelledby="about-mission-title">
        <MissionCard
          title={aboutPage.missionTitle ?? ''}
          text={aboutPage.missionText ?? ''}
        />
      </section>
      {/* Features Section */}
      <section className="rounded-2xl bg-background/95 shadow-md mb-12 py-8 px-2" aria-labelledby="about-features-title">
        <WhyChooseUsSection features={aboutPage.features} />
      </section>
      {/* Testimonials Section */}
      <section className="rounded-2xl bg-feature-suppliers/10 shadow-inner mb-12 py-8 px-2" aria-labelledby="about-testimonials-title">
        <TestimonialsSection testimonials={aboutPage.testimonials ?? []} />
      </section>
      {/* Call to Action Section */}
      <section className="rounded-2xl bg-background/90 shadow-md mb-4 py-8 px-2" aria-labelledby="about-cta-title">
        <CallToActionSection
          title={aboutPage.ctaTitle}
          text={aboutPage.ctaText}
          buttonText={aboutPage.ctaButtonText}
          buttonLink={aboutPage.ctaButtonLink}
        />
      </section>
      {/* FAQ Section */}
      <section className="rounded-2xl bg-background/95 shadow-md mb-12 py-8 px-2" aria-labelledby="about-faq-title">
        <FAQSection faq={aboutPage.faq ?? []} />
      </section>
    </main>
  );
};

export default AboutPage;
