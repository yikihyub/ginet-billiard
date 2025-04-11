import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, order, isActive } = body
    
    const newCategory = await prisma.bi_faq_category.create({
      data: {
        name,
        display_order: order !== undefined ? parseInt(order) : 0,
        is_active: isActive !== undefined ? isActive : true
      }
    })
    
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('카테고리 생성 중 오류 발생:', error)
    return NextResponse.json(
      { error: '카테고리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}