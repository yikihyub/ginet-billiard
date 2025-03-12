// lib/supabase/storage-utils.ts
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 이미지 스토리지 버킷 이름
const BUCKET_NAME = 'images';

/**
 * Supabase Storage에 이미지 업로드
 */
export async function uploadImageToSupabase(
  file: File,
  folder: string = 'uploads',
  customFilename?: string
): Promise<{
  url: string;
  publicId: string;
  error: Error | null;
  fileMetadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    width?: number;
    height?: number;
  };
}> {
  try {
    // 랜덤 파일명 생성 (중복 방지)
    const uniqueId = uuidv4();
    const originalFilename = file.name;
    const extension = originalFilename.split('.').pop();
    const filename = customFilename 
      ? `${customFilename}.${extension}` 
      : `${uniqueId}.${extension}`;

    // 파일 경로 생성
    const filePath = `${folder}/${filename}`;

    // 이미지 메타데이터 수집 (너비, 높이 등)
    const fileMetadata = await getImageMetadata(file);

    // data,
    // Supabase에 업로드
    const {  error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 업로드된 이미지의 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      publicId: filePath,
      error: null,
      fileMetadata: {
        fileName: originalFilename,
        fileSize: file.size,
        fileType: file.type,
        width: fileMetadata.width,
        height: fileMetadata.height,
      },
    };
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    return {
      url: '',
      publicId: '',
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
      fileMetadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    };
  }
}

/**
 * Supabase Storage에서 이미지 삭제
 */
export async function deleteImageFromSupabase(
  publicId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([publicId]);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}

/**
 * 이미지 파일의 메타데이터 추출 (너비, 높이 등)
 */
async function getImageMetadata(
  file: File
): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    // 이미지 파일이 아닌 경우 기본값 반환
    if (!file.type.startsWith('image/')) {
      resolve({});
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      resolve({});
    };
    img.src = URL.createObjectURL(file);
  });
}