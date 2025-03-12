import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
// 이미지 스토리지 버킷 이름
    const BUCKET_NAME = 'images';

// 버킷이 존재하는지 확인하고 없으면 생성하는 함수
async function ensureFolderExists(bucketName: string, folder: string) {
  try {
    // 폴더가 없으면 빈 파일을 업로드해서 폴더 생성
    await supabase.storage
      .from(bucketName)
      .upload(`${folder}/.folder`, new Uint8Array(0), {
        upsert: true
      });
    console.log(`Folder '${folder}' created or already exists`);
  } catch (error) {
    console.log(error);
    // 폴더가 이미 존재하면 무시
    console.log('Folder already exists or failed to create folder');
  }
}


export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;
    const entityType = data.get('entityType') as string | null; 
    const entityId = data.get('entityId') as string | null;
    const bucketName = data.get('bucket') as string || BUCKET_NAME;

    console.log(bucketName);

    const alt = data.get('alt') as string | null;
    const description = data.get('description') as string | null;

    const folder = entityType || 'uploads';
    await ensureFolderExists(BUCKET_NAME, folder);
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // 파일을 Buffer로 변환
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // 파일명 생성
    const now = new Date();
    const timestamp = now.getTime().toString();
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const extension = file.name.split('.').pop();
    const fileName = `${originalName}_${timestamp}.${extension}`;

    // Supabase Storage에 업로드할 경로 설정

    const filePath = `${folder}/${fileName}`;

    // 폴더가 없으면 빈 파일을 업로드해서 폴더 생성 (Supabase는 폴더 생성 API가 없음)
    // 이미 존재하는 파일이면 에러가 발생하지만 무시해도 됨
    try {
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(`${folder}/.folder`, new Uint8Array(0), {
          upsert: true
        });
    } catch (error) {
      console.log(error);
      // 폴더가 이미 존재하면 오류가 발생할 수 있지만 무시
      console.log('Folder already exists or failed to create folder placeholder');
    }

    // Supabase Storage에 파일 업로드
    const { data: uploadData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

      console.log(uploadData);

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}` },
        { status: 500 }
      );
    }

    // 업로드된 파일의 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // 데이터베이스에 이미지 정보 저장
    const image = await prisma.bi_image.create({
      data: {
        url: urlData.publicUrl,
        public_id: filePath,
        file_name: file.name,
        file_size: buffer.length,
        file_type: file.type,
        alt: alt || null,
        description: description || null,
        entity_type: entityType || null,
        entity_id: entityId || null,
        created_at: now,
        updated_at: now
      }
    });

    return NextResponse.json(image);
  } catch (error: any) {
    console.error('Error in image upload API:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}