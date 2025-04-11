import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 특정 FAQ 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    const faq = await prisma.bi_faq.findUnique({
      where: { id },
      include: { bi_faq_category: true }
    })
    
    if (!faq) {
      return NextResponse.json(
        { error: '해당 FAQ를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(faq)
  } catch (error) {
    console.error('FAQ 조회 중 오류 발생:', error)
    return NextResponse.json(
      { error: 'FAQ 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}