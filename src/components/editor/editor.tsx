'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  Heading3 as Heading3Icon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  ChevronDown as ChevronDownIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './editor-style.css';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const colors = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#CCCCCC',
  '#FF0000',
  '#FF6600',
  '#FFCC00',
  '#33CC00',
  '#00CCFF',
  '#0066FF',
  '#3300FF',
  '#9900FF',
  '#FF00CC',
  '#FF0066',
];

export default function Editor({
  value,
  onChange,
  placeholder = '공지사항 내용을 입력하세요...',
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt('이미지 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = prompt('URL을 입력하세요:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const isActive = (type: string, options?: Record<string, any>) => {
    return editor.isActive(type, options ?? {});
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 p-2">
        <TooltipProvider delayDuration={300}>
          <div className="mr-2 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="h-8 w-8 p-0"
                >
                  <UndoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>실행 취소</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="h-8 w-8 p-0"
                >
                  <RedoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>다시 실행</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* 헤딩 */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-8 gap-1',
                      isActive('heading') && 'bg-accent'
                    )}
                  >
                    {isActive('heading', { level: 1 }) && (
                      <Heading1Icon className="h-4 w-4" />
                    )}
                    {isActive('heading', { level: 2 }) && (
                      <Heading2Icon className="h-4 w-4" />
                    )}
                    {isActive('heading', { level: 3 }) && (
                      <Heading3Icon className="h-4 w-4" />
                    )}
                    {!isActive('heading') && (
                      <Heading1Icon className="h-4 w-4" />
                    )}
                    <ChevronDownIcon className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>제목</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-auto p-2">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant={
                    isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className="justify-start"
                >
                  <Heading1Icon className="mr-2 h-4 w-4" />
                  <span>제목 1</span>
                </Button>
                <Button
                  type="button"
                  variant={
                    isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className="justify-start"
                >
                  <Heading2Icon className="mr-2 h-4 w-4" />
                  <span>제목 2</span>
                </Button>
                <Button
                  type="button"
                  variant={
                    isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className="justify-start"
                >
                  <Heading3Icon className="mr-2 h-4 w-4" />
                  <span>제목 3</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* 텍스트 스타일 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('bold') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
              >
                <BoldIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>굵게</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('italic') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
              >
                <ItalicIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>기울임</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('underline') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className="h-8 w-8 p-0"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>밑줄</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('strike') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className="h-8 w-8 p-0"
              >
                <StrikethroughIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>취소선</TooltipContent>
          </Tooltip>

          {/* 색상 선택기 */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded border">
                      <span
                        className="h-3 w-3"
                        style={{
                          backgroundColor:
                            editor.getAttributes('textStyle').color ||
                            'currentColor',
                        }}
                      />
                    </span>
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>글자 색상</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={cn(
                      'h-6 w-6 rounded border transition-transform hover:scale-110',
                      editor.getAttributes('textStyle').color === color &&
                        'ring-2 ring-primary ring-offset-1'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* 정렬 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('left') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign('left').run()
                }
                className="h-8 w-8 p-0"
              >
                <AlignLeftIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>왼쪽 정렬</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('center') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign('center').run()
                }
                className="h-8 w-8 p-0"
              >
                <AlignCenterIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>가운데 정렬</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('right') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign('right').run()
                }
                className="h-8 w-8 p-0"
              >
                <AlignRightIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>오른쪽 정렬</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* 리스트 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('bulletList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>글머리 기호 목록</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('orderedList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
              >
                <ListOrderedIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>번호 목록</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* 링크 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isActive('link') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={setLink}
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>링크</TooltipContent>
          </Tooltip>

          {/* 이미지 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="h-8 w-8 p-0"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>이미지</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 에디터 영역 */}
      <div className="editor-content min-h-[300px] bg-white px-4 py-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
