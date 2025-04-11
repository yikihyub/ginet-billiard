'use client';

import { useState, useEffect } from 'react';

type Faq = {
  id: number;
  question: string;
  answer: string;
  category_id: number | null;
  category: Category | null;
  is_active: boolean;
  order: number;
};

type Category = {
  id: number;
  name: string;
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 현재 편집 중인 FAQ
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // 신규 FAQ 폼 상태
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category_id: '',
    is_active: true,
    order: 0,
  });

  // FAQ 목록 불러오기
  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/faq/getfaq');
      if (!response.ok) throw new Error('FAQ 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setFaqs(data);
    } catch (err) {
      setError('FAQ 목록을 불러오는데 문제가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 목록 불러오기
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/faq/category/getcategory');
      if (!response.ok)
        throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('카테고리 로딩 오류:', err);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, []);

  // 신규 FAQ 생성
  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/faq/postfaq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      });

      if (!response.ok) throw new Error('FAQ 생성에 실패했습니다.');

      // 성공 시 목록 갱신 및 폼 초기화
      fetchFaqs();
      setNewFaq({
        question: '',
        answer: '',
        category_id: '',
        is_active: true,
        order: 0,
      });
    } catch (err) {
      console.error('FAQ 생성 오류:', err);
    }
  };

  // FAQ 업데이트
  const handleUpdateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      const response = await fetch(`/api/faq/${editingFaq.id}/updatesearch`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      if (!response.ok) throw new Error('FAQ 업데이트에 실패했습니다.');

      // 성공 시 목록 갱신 및 편집 모드 종료
      fetchFaqs();
      setEditingFaq(null);
    } catch (err) {
      console.error('FAQ 업데이트 오류:', err);
    }
  };

  // FAQ 삭제
  const handleDeleteFaq = async (id: number) => {
    if (!confirm('정말로 이 FAQ를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/faq/${id}/deletesearch`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('FAQ 삭제에 실패했습니다.');

      // 성공 시 목록 갱신
      fetchFaqs();
    } catch (err) {
      console.error('FAQ 삭제 오류:', err);
    }
  };

  if (isLoading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">FAQ 관리</h1>

      {/* 신규 FAQ 생성 폼 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">새 FAQ 추가</h2>
        <form onSubmit={handleCreateFaq}>
          <div className="mb-4 grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block font-medium">질문</label>
              <input
                type="text"
                className="w-full rounded border p-2"
                value={newFaq.question}
                onChange={(e) =>
                  setNewFaq({ ...newFaq, question: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">답변</label>
              <textarea
                className="min-h-32 w-full rounded border p-2"
                value={newFaq.answer}
                onChange={(e) =>
                  setNewFaq({ ...newFaq, answer: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block font-medium">카테고리</label>
                <select
                  className="w-full rounded border p-2"
                  value={newFaq.category_id}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, category_id: e.target.value })
                  }
                >
                  <option value="">카테고리 없음</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">순서</label>
                <input
                  type="number"
                  className="w-full rounded border p-2"
                  value={newFaq.order}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, order: Number(e.target.value) })
                  }
                />
              </div>

              <div className="mt-8 flex items-center">
                <input
                  type="checkbox"
                  id="newFaqActive"
                  checked={newFaq.is_active}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="newFaqActive">활성화</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            FAQ 추가
          </button>
        </form>
      </div>

      {/* FAQ 목록 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">FAQ 목록</h2>

        {faqs.length === 0 ? (
          <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
        ) : (
          <div className="divide-y">
            {faqs.map((faq) => (
              <div key={faq.id} className="py-4">
                {editingFaq && editingFaq.id === faq.id ? (
                  // 편집 모드
                  <form onSubmit={handleUpdateFaq} className="space-y-4">
                    <div>
                      <label className="mb-1 block font-medium">질문</label>
                      <input
                        type="text"
                        className="w-full rounded border p-2"
                        value={editingFaq.question}
                        onChange={(e) =>
                          setEditingFaq({
                            ...editingFaq,
                            question: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-medium">답변</label>
                      <textarea
                        className="min-h-32 w-full rounded border p-2"
                        value={editingFaq.answer}
                        onChange={(e) =>
                          setEditingFaq({
                            ...editingFaq,
                            answer: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block font-medium">
                          카테고리
                        </label>
                        <select
                          className="w-full rounded border p-2"
                          value={editingFaq.category_id || ''}
                          onChange={(e) =>
                            setEditingFaq({
                              ...editingFaq,
                              category_id: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          }
                        >
                          <option value="">카테고리 없음</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block font-medium">순서</label>
                        <input
                          type="number"
                          className="w-full rounded border p-2"
                          value={editingFaq.order}
                          onChange={(e) =>
                            setEditingFaq({
                              ...editingFaq,
                              order: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="mt-8 flex items-center">
                        <input
                          type="checkbox"
                          id={`faqActive${faq.id}`}
                          checked={editingFaq.is_active}
                          onChange={(e) =>
                            setEditingFaq({
                              ...editingFaq,
                              is_active: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`faqActive${faq.id}`}>활성화</label>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFaq(null)}
                        className="rounded bg-gray-300 px-3 py-1 text-gray-800 hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  // 보기 모드
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{faq.question}</h3>
                        <p className="mt-1 whitespace-pre-line text-gray-600">
                          {faq.answer}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          {faq.category_id
                            ? `카테고리: ${
                                categories.find(
                                  (cat) => cat.id === faq.category_id
                                )?.name || '이름 없음'
                              }`
                            : '카테고리 없음'}{' '}
                          &nbsp; | 순서: {faq.order} | 상태:{' '}
                          {faq.is_active ? '활성' : '비활성'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingFaq(faq)}
                          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
