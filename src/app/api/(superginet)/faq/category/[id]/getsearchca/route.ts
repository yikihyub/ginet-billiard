
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 특정 카테고리 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    const category = await prisma.bi_faq_category.findUnique({
      where: { id },
      include: {
        bi_faq: {
          where: { is_active: true },
          orderBy: { display_order: 'asc' }
        }
      }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: '해당 카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('카테고리 조회 중 오류 발생:', error)
    return NextResponse.json(
      { error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}