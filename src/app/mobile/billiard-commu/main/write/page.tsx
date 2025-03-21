'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { cn } from '@/lib/utils';

interface PostCategory {
  id: number;
  name: string;
  description: string;
  value: string;
}

interface UploadedImage {
  id: number;
  url: string;
}

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    tags: '',
  });
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [categoryData, setCategoryData] = useState<{ categories: any[] }>({
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { toast } = useToast();
  const { data: session, status } = useSession();
  const userId = session?.user.mb_id;
  const router = useRouter();
  const params = useParams();
  const postId = params?.post_id;
  const isEditMode = !!postId;

  console.log(userId);

  useEffect(() => {
    if (isEditMode) {
      const fetchPostData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/community/${postId}`);
          if (!res.ok) throw new Error('게시글을 불러오는데 실패했습니다.');

          const data = await res.json();

          // 폼 데이터 설정
          setFormData({
            title: data.title || '',
            content: data.content || '',
            categoryId: data.category_id?.toString() || '',
            tags:
              data.bi_post_tag
                ?.map((tag: any) => tag.bi_tag?.name || tag.name)
                .join(', ') || '',
          });

          // 이미지 설정
          if (data.bi_post_image && data.bi_post_image.length > 0) {
            setImages(
              data.bi_post_image.map((img: any) => ({
                id: img.id,
                url: img.image_url,
              }))
            );
          }
        } catch (error) {
          console.error('Error fetching post data:', error);
          toast({ title: '게시글 정보를 불러오는데 실패했습니다.' });
        } finally {
          setIsLoading(false);
        }
      };

      fetchPostData();
    }
  }, [isEditMode, postId, toast]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/community/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');

      const data = await res.json();
      setCategoryData(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setIsError(true);
      console.log(isError);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect에서 fetchCategories 호출
  useEffect(() => {
    fetchCategories();
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 로그인 확인
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        {' '}
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />{' '}
      </div>
    );
  }
  if (status === 'unauthenticated') {
    router.replace('/login?callbackUrl=/community/write');
    return null;
  }

  // ✅ `categories`를 올바르게 추출
  const categories: PostCategory[] = categoryData?.categories ?? [];

  // 입력 폼 변경 핸들러
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      setImages((prev) => [...prev, ...data.images]);
      toast({ title: '이미지가 업로드되었습니다.' });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({ title: '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 게시글 등록 핸들러
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ title: '제목을 입력해주세요.' });
      return;
    }

    if (!formData.content.trim()) {
      toast({ title: '내용을 입력해주세요.' });
      return;
    }

    if (!formData.categoryId) {
      toast({ title: '카테고리를 선택해주세요.' });
      return;
    }

    setSubmitting(true);

    try {
      const endpoint = isEditMode
        ? `/api/community/posts/${postId}/updateposts`
        : '/api/community/posts/postposts';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category_id: formData.categoryId,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          imageIds: images.map((img) => img.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      toast({ title: '게시글이 등록되었습니다.' });
      router.push(
        `/mobile/billiard-commu/main/${isEditMode ? postId : data.post_id}`
      );
    } catch (error) {
      console.error('Error creating post:', error);
      toast({ title: '게시글 등록에 실패했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    <div>loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <form onSubmit={handleSubmit} className="flex-1 p-4">
        {/* 카테고리 선택 */}
        <div className="mb-4">
          {Array.isArray(categories) && categories.length > 0 ? (
            <Select
              value={formData.categoryId?.toString() || ''}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger className="text-md h-14 w-full rounded-md border border-gray-300 px-4 py-6 shadow-none">
                <SelectValue
                  placeholder="카테고리 선택"
                  className={cn(
                    !formData.categoryId ? 'text-gray-100' : 'text-black'
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-500">카테고리를 불러오는 중...</p>
          )}
        </div>

        {/* 제목 입력 */}
        <div>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className={cn(
              'h-12 w-full rounded-none bg-transparent p-4 text-lg shadow-none',
              'border border-transparent border-b-gray-300',
              'transition-all duration-200 ease-in-out'
            )}
            maxLength={100}
          />
        </div>

        {/* 내용 입력 */}
        <div className="mb-4">
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={
              '내용을 입력하세요.\n내용 최소 10글자 ~ 최대 1000자\n 사진 최대 2장까지 가능'
            }
            className={cn(
              'text-md h-[200px] w-full rounded-none border-none bg-transparent p-4 shadow-none',
              'transition-all duration-200 ease-in-out'
            )}
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative rounded-lg bg-gray-100">
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="h-24 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-black bg-opacity-50 p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                    <span className="mt-1 text-xs text-gray-500">
                      이미지 추가
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="mt-1 text-xs text-gray-500">
            최대 5장까지 업로드 가능합니다. (1장당 10MB 이하)
          </p>
        </div>

        {/* 태그 입력 */}
        <div className="mb-6">
          <Label htmlFor="tags" className="mb-1 block text-sm font-medium">
            태그 (선택사항)
          </Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="쉼표(,)로 구분하여 입력하세요"
            className="border-gray-300"
          />
          <p className="mt-1 text-xs text-gray-500">
            예) 당구초보, 당구장추천, 큐대추천
          </p>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={submitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? '수정 중...' : '등록 중...'}
              </>
            ) : isEditMode ? (
              '수정하기'
            ) : (
              '등록하기'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
