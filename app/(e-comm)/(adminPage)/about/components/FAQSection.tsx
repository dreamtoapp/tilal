import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

type FAQ = {
    id: string;
    question: string;
    answer: string;
};

type FAQSectionProps = {
    faq: FAQ[];
};

const FAQSection = ({ faq }: FAQSectionProps) => {
    if (!faq || faq.length === 0) return null;
    return (
        <section className="mb-16 animate-fade-in-up" aria-labelledby="about-faq-title">
            <h2 id="about-faq-title" className="text-3xl font-bold text-center mb-8 font-arabic">الأسئلة الشائعة</h2>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
                {faq.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="font-arabic text-lg text-right">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="font-arabic text-md text-muted-foreground text-right">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
};

export default FAQSection; 