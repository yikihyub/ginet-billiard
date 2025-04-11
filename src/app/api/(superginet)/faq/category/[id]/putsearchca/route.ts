
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    const body = await request.json()
    const { name, order, isActive } = body
    
    const updatedCategory = await prisma.bi_faq_category.update({
      where: { id },
      data: {
        name,
        display_order: order !== undefined ? parseInt(order) : undefined,
        is_active: isActive !== undefined ? isActive : undefined
      }
    })
    
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('카테고리 업데이트 중 오류 발생:', error)
    return NextResponse.json(
      { error: '카테고리 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}