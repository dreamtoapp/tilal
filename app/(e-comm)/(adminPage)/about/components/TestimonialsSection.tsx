import TestimonialSlider from './TestimonialSlider';

const TestimonialsSection = ({ testimonials }: { testimonials: any[] }) => (
    <section className='mb-16 animate-fade-in-up' style={{ animationDelay: '600ms' }}>
        <h2 className='text-3xl font-bold text-center mb-4'>ماذا يقول عملاؤنا؟</h2>
        <p className='text-center text-muted-foreground mb-10'>
            تقييمات مميزة من عملائنا الكرام تعكس جودة خدماتنا الاستثنائية
        </p>
        <TestimonialSlider testimonials={testimonials} />
    </section>
);

export default TestimonialsSection; 