import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    const body = await request.json()
    const { question, answer, categoryId, order, isActive } = body
    
    const updatedFaq = await prisma.bi_faq.update({
      where: { id },
      data: {
        question,
        answer,
        category_id: categoryId ? parseInt(categoryId) : null,
        display_order: order !== undefined ? parseInt(order) : undefined,
        is_active: isActive !== undefined ? isActive : undefined
      }
    })
    
    return NextResponse.json(updatedFaq)
  } catch (error) {
    console.error('FAQ 업데이트 중 오류 발생:', error)
    return NextResponse.json(
      { error: 'FAQ 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}