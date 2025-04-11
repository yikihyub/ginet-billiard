import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 카테고리 목록 조회
export async function GET() {
  try {
    const categories = await prisma.bi_faq_category.findMany({
      where: {
        is_active: true
      },
      orderBy: {
        display_order: 'asc'
      }
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('카테고리 조회 중 오류 발생:', error)
    return NextResponse.json(
      { error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}