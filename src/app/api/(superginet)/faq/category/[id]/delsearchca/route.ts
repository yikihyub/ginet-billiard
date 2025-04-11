
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    // 연결된 FAQ의 카테고리 ID를 null로 설정
    await prisma.bi_faq.updateMany({
      where: { category_id: id },
      data: { category_id: null }
    })
    
    // 카테고리 삭제
    await prisma.bi_faq_category.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: '카테고리가 성공적으로 삭제되었습니다.' })
  } catch (error) {
    console.error('카테고리 삭제 중 오류 발생:', error)
    return NextResponse.json(
      { error: '카테고리 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}