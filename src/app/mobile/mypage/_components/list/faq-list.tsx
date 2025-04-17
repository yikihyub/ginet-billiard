'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Faq = {
  id: number;
  question: string;
  answer: string;
  category_id: number | null;
  is_active: boolean | null;
};

type Category = {
  id: number;
  name: string;
};

interface Props {
  faqs: Faq[];
  categories: Category[];
}

export default function FaqListClient({ faqs, categories }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const filteredFaqs =
    selectedCategoryId === null
      ? faqs
      : faqs.filter((faq) => faq.category_id === selectedCategoryId);

  return (
    <>
      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {[{ id: null, name: '전체' }, ...categories].map((cat) => (
          <button
            key={cat.id ?? 'all'}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`flex-shrink-0 rounded border px-3 py-1.5 text-sm font-medium transition ${
              selectedCategoryId === cat.id
                ? 'bg-black text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 전체 FAQ 개수 */}
      <div className="p-4">
        <p className="text-sm text-gray-500">
          총 {faqs.length}개의 질문이 있습니다
        </p>
      </div>

      {/* FAQ 리스트 */}
      <div className="">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            해당 카테고리의 질문이 없습니다.
          </p>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className="border-b">
              <details className="group transition-all open:bg-gray-50">
                <summary className="flex cursor-pointer items-center justify-between p-4">
                  <span className="text-sm font-medium text-gray-800">
                    Q. {faq.question}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="whitespace-pre-line p-4 text-sm text-gray-600">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        summary::-webkit-details-marker {
          display: none;
        }

        summary::marker {
          display: none;
        }
      `}</style>
    </>
  );
}
