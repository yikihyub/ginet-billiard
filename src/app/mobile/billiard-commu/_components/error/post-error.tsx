import Tab from '../tab/tab';

export default function PostError() {
  return (
    <div className="flex flex-col bg-gray-50">
      <Tab />
      <div className="flex h-32 items-center justify-center">
        <p className="text-red-500">
          게시글을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    </div>
  );
}
