import { NextRequest, NextResponse } from 'next/server'
import { queryRag } from '@/lib/rag/engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const question = body?.question?.trim()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const result = await queryRag(question)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in chat RAG endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    )
  }
}

