import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    await prisma.bi_faq.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'FAQ가 성공적으로 삭제되었습니다.' })
  } catch (error) {
    console.error('FAQ 삭제 중 오류 발생:', error)
    return NextResponse.json(
      { error: 'FAQ 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}