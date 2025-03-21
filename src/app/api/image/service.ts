import { prisma } from '@/lib/prisma';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/storage-utils';

import { BiImage, ImageUploadParams, ImageUpdateParams } from '@/types/(image)/image';

/**
 * 이미지 업로드 및 DB 저장
 */
export async function uploadImage(params: ImageUploadParams): Promise<BiImage | null> {
  const { file, alt, description, userId, folder = 'uploads', entityType, entityId } = params;

  try {
    // 1. Supabase 스토리지에 이미지 업로드
    const { url, publicId, fileMetadata, error } = await uploadImageToSupabase(file, folder);

    if (error) {
      throw error;
    }

  // 2. 업로드된 이미지 정보를 DB에 저장 - 스네이크 케이스 사용
  const image = await prisma.bi_image.create({
    data: {
      url,
      public_id: publicId ?? null, // null 허용
      file_name: fileMetadata.fileName,
      file_size: fileMetadata.fileSize,
      file_type: fileMetadata.fileType,
      width: fileMetadata.width ?? null, // Int? → null 허용
      height: fileMetadata.height ?? null, // Int? → null 허용
      alt: alt ?? null, // String? → null 허용
      description: description ?? null, // String? → null 허용
      user_id: userId ?? null, // String? → null 허용
      entity_type: entityType ?? null, // String? → null 허용
      entity_id: entityId ?? null, // String? → null 허용
    },
  });

    return image; // 타입 BiImage와 일치함
  } catch (error) {
    console.error('Error in uploadImage service:', error);
    return null;
  }
}

/**
 * 단일 이미지 조회
 */
export async function getImage(id: number): Promise<BiImage | null> {
  try {
    const image = await prisma.bi_image.findUnique({
      where: { id },
    });
    
    return image;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

/**
 * 이미지 정보 업데이트 (메타데이터만)
 */
export async function updateImage(params: ImageUpdateParams): Promise<BiImage | null> {
  const { id, alt, description } = params;
  
  try {
    const image = await prisma.bi_image.update({
      where: { id },
      data: {
        alt,
        description,
      },
    });
    
    return image;
  } catch (error) {
    console.error('Error updating image:', error);
    return null;
  }
}

/**
 * 이미지 삭제 (스토리지 + DB)
 */
export async function deleteImage(id: number): Promise<boolean> {
  try {
    // 1. DB에서 이미지 정보 조회
    const image = await prisma.bi_image.findUnique({
      where: { id },
    });

    if (!image || !image.public_id) {
      throw new Error('Image not found or missing public ID');
    }

    // 2. Supabase 스토리지에서 파일 삭제
    const { success, error } = await deleteImageFromSupabase(image.public_id);
    
    if (!success) {
      throw error || new Error('Failed to delete image from storage');
    }

    // 3. DB에서 이미지 레코드 삭제
    await prisma.bi_image.delete({
      where: { id },
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * 특정 엔티티에 연결된 이미지 목록 조회
 */
export async function getImagesByEntity(
  entityType: string,
  entityId: string
): Promise<BiImage[]> {
  try {
    const images = await prisma.bi_image.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching images by entity:', error);
    return [];
  }
}