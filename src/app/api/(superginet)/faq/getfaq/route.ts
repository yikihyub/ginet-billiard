import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')
  
  try {
    const faqs = await prisma.bi_faq.findMany({
      where: {
        is_active: true,
        ...(categoryId ? { category_id: parseInt(categoryId) } : {})
      },
      orderBy: {
        display_order: 'asc'
      },
      include: {
        bi_faq_category: true
      }
    })
    
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('FAQ 조회 중 오류 발생:', error)
    return NextResponse.json(
      { error: 'FAQ 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}