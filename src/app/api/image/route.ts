import { NextRequest, NextResponse } from 'next/server';
import { getImagesByEntity } from './service';

// 이미지 목록 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    // entityType과 entityId가 모두 필요
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and entity ID are required' },
        { status: 400 }
      );
    }

    const images = await getImagesByEntity(entityType, entityId);
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error in fetch images API:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}