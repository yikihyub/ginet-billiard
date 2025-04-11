'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Category = {
  id: number;
  name: string;
  order: number;
  is_active: boolean;
};

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 현재 편집 중인 카테고리
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // 신규 카테고리 폼 상태
  const [newCategory, setNewCategory] = useState({
    name: '',
    order: 0,
    is_active: true,
  });

  // 카테고리 목록 불러오기
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/faq/category/getcategory');
      if (!response.ok)
        throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('카테고리 목록을 불러오는데 문제가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchCategories();
  }, []);

  // 신규 카테고리 생성
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/faq/category/postcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error('카테고리 생성에 실패했습니다.');

      // 성공 시 목록 갱신 및 폼 초기화
      fetchCategories();
      setNewCategory({
        name: '',
        order: 0,
        is_active: true,
      });
    } catch (err) {
      console.error('카테고리 생성 오류:', err);
    }
  };

  // 카테고리 업데이트
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const response = await fetch(
        `/api/faq/category/${editingCategory.id}/putsearchca`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory),
        }
      );

      if (!response.ok) throw new Error('카테고리 업데이트에 실패했습니다.');

      // 성공 시 목록 갱신 및 편집 모드 종료
      fetchCategories();
      setEditingCategory(null);
    } catch (err) {
      console.error('카테고리 업데이트 오류:', err);
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        '정말로 이 카테고리를 삭제하시겠습니까? 연결된 FAQ는 카테고리 없음으로 설정됩니다.'
      )
    )
      return;

    try {
      const response = await fetch(`/api/faq/category/${id}/delsearchca`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('카테고리 삭제에 실패했습니다.');

      // 성공 시 목록 갱신
      fetchCategories();
    } catch (err) {
      console.error('카테고리 삭제 오류:', err);
    }
  };

  if (isLoading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">카테고리 관리</h1>
        <Link
          href="/admin/faq"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          FAQ 관리
        </Link>
      </div>

      {/* 신규 카테고리 생성 폼 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">새 카테고리 추가</h2>
        <form onSubmit={handleCreateCategory}>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block font-medium">카테고리 이름</label>
              <input
                type="text"
                className="w-full rounded border p-2"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">순서</label>
              <input
                type="number"
                className="w-full rounded border p-2"
                value={newCategory.order}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="mt-8 flex items-center">
              <input
                type="checkbox"
                id="newCategoryActive"
                checked={newCategory.is_active}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    is_active: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label htmlFor="newCategoryActive">활성화</label>
            </div>
          </div>

          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            카테고리 추가
          </button>
        </form>
      </div>

      {/* 카테고리 목록 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">카테고리 목록</h2>

        {categories.length === 0 ? (
          <p className="text-gray-500">등록된 카테고리가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    순서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categories.map((category) => (
                  <tr key={category.id}>
                    {editingCategory && editingCategory.id === category.id ? (
                      // 편집 모드
                      <td colSpan={5} className="px-6 py-4">
                        <form
                          onSubmit={handleUpdateCategory}
                          className="grid grid-cols-1 gap-4 md:grid-cols-4"
                        >
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              카테고리 이름
                            </label>
                            <input
                              type="text"
                              className="w-full rounded border p-2"
                              value={editingCategory.name}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              순서
                            </label>
                            <input
                              type="number"
                              className="w-full rounded border p-2"
                              value={editingCategory.order}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  order: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div className="mt-6 flex items-center">
                            <input
                              type="checkbox"
                              id={`categoryActive${category.id}`}
                              checked={editingCategory.is_active}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  is_active: e.target.checked,
                                })
                              }
                              className="mr-2"
                            />
                            <label
                              htmlFor={`categoryActive${category.id}`}
                              className="text-sm"
                            >
                              활성화
                            </label>
                          </div>

                          <div className="mt-4 flex items-center space-x-2">
                            <button
                              type="submit"
                              className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategory(null)}
                              className="rounded bg-gray-300 px-3 py-1 text-sm text-gray-800 hover:bg-gray-400"
                            >
                              취소
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      // 보기 모드
                      <>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {category.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {category.order}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              category.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.is_active ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="ml-3 text-red-600 hover:text-red-900"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
