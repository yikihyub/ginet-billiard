'use client';

interface PostTag {
  id: number;
  name: string;
  post_id?: number;
  tag_id?: number;
  bi_tag?: {
    id: number;
    name: string;
  };
}

interface PostContentProps {
  title: string;
  content: string;
  tags?: PostTag[];
}

export default function PostContent({
  title,
  content,
  tags,
}: PostContentProps) {
  return (
    <div className="px-4 pb-3">
      {/* 제목 및 내용 */}
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <div className="whitespace-pre-wrap text-base">{content}</div>

      {/* 태그 */}
      {tags && tags.length > 0 && (
        <div className="mb-4 mt-3 flex flex-wrap gap-2">
          {tags.map((tagItem) => (
            <span
              key={tagItem.id}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              #{tagItem.name || tagItem.bi_tag?.name || '태그'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
