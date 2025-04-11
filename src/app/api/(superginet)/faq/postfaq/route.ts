import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, answer, category_id, display_order, is_active, created_by } = body
    
    console.log(body)

    const newFaq = await prisma.bi_faq.create({
      data: {
        question,
        answer,
        category_id: category_id ? parseInt(category_id) : null,
        display_order: display_order ? parseInt(display_order) : 0,
        is_active: is_active !== undefined ? is_active : true,
        created_by: created_by || 'system',
        updated_by: created_by || 'system'
      }
    })
    
    console.log(newFaq)
    
    return NextResponse.json(newFaq, { status: 201 })
  } catch (error) {
    console.error('FAQ 생성 중 오류 발생:', error)
    return NextResponse.json(
      { error: 'FAQ 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}