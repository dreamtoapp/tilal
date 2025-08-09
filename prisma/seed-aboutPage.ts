import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ensure only one AboutPageContent per brandId
  await prisma.aboutPageContent.deleteMany({ where: { brandId: 'brand1' } });

  // Create AboutPageContent
  await prisma.aboutPageContent.create({
    data: {
      brandId: 'brand1',
      heroTitle: 'اكتشف قصتنا',
      heroSubtitle: 'نحن نؤمن بأن الماء النقي هو أساس الحياة الصحية. نقدم لكم مياه أمواج بمعايير جودة عالمية.',
      heroImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      missionTitle: 'رسالتنا',
      missionText: 'نسعى لتوفير مياه شرب نقية وصحية لكل منزل ومكتب في المملكة، مع الالتزام بالاستدامة البيئية والجودة العالمية، لنكون جزءًا من حياة صحية ومستدامة لمجتمعنا.',
      ctaTitle: 'جاهز لتجربة النقاء؟',
      ctaText: 'انضم إلى آلاف العملاء السعداء واستمتع بمياه أمواج النقية التي تصلك حتى باب منزلك.',
      ctaButtonText: 'اطلب الآن',
      ctaButtonLink: '/#products',
      contactLink: '/contact',
      features: {
        create: [
          {
            icon: 'truck',
            title: 'توصيل فوري',
            description: 'أسطولنا الحديث يصلك أينما كنت، بسرعة وكفاءة، لضمان راحتك دائمًا.',
            imageUrl: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b1a48?auto=format&fit=crop&w=400&q=80',
          },
          {
            icon: 'star',
            title: 'جودة لا تضاهى',
            description: 'مياهنا معتمدة عالميًا، مفلترة بتقنيات متطورة لنقاء لا مثيل له.',
            imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
          },
          {
            icon: 'mapPin',
            title: 'تغطية شاملة',
            description: 'فروعنا منتشرة لنكون دائمًا بالقرب منك، جاهزون لخدمتك في أي وقت.',
            imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
          },
          {
            icon: 'droplet',
            title: 'تركيبة صحية',
            description: 'مياه غنية بالمعادن الأساسية لدعم صحتك ونشاطك اليومي.',
            imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          },
          {
            icon: 'shieldCheck',
            title: 'أمان مضمون',
            description: 'اختبارات جودة يومية لضمان سلامتك وراحة بالك.',
            imageUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=400&q=80',
          },
          {
            icon: 'award',
            title: 'ثقة وتميز',
            description: 'نفخر بخدمة آلاف العملاء بجودة وثقة لا تتزعزع.',
            imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      faq: {
        create: [
          {
            question: 'كيف يمكنني التواصل مع الدعم؟',
            answer: 'يمكنك التواصل معنا عبر صفحة الاتصال أو الاتصال على الرقم الموحد الموجود في الموقع.',
          },
          {
            question: 'ما هي سياسة الاسترجاع لديكم؟',
            answer: 'نوفر سياسة استرجاع خلال 14 يومًا من تاريخ الاستلام لجميع المنتجات.',
          },
          {
            question: 'هل المياه معتمدة من جهات رسمية؟',
            answer: 'نعم، جميع منتجاتنا معتمدة من الجهات الصحية والرسمية في المملكة.',
          },
          {
            question: 'هل يوجد اشتراك شهري أو توصيل مجدول؟',
            answer: 'نعم، نوفر خيارات اشتراك شهري وتوصيل مجدول حسب رغبتك.',
          },
        ],
      },
    },
    include: {
      features: true,
      faq: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 