import { prisma } from '@/lib/prisma';
import FaqListClient from '../../_components/list/faq-list';
import FaqHeader from '../../_components/header/faq-header';

export default async function CustomerSupportPage() {
  const [faqs, categories] = await Promise.all([
    prisma.bi_faq.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    }),
    prisma.bi_faq_category.findMany({ orderBy: { id: 'asc' } }),
  ]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      <FaqHeader />
      <FaqListClient faqs={faqs} categories={categories} />
    </div>
  );
}
