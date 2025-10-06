import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { threadId: string; replyId: string } }) {
  const body = await request.json()
  const { voteType } = body // 'up' or 'down'

  console.log(`[v0] ${voteType}voting reply ${params.replyId} in thread ${params.threadId}`)

  return NextResponse.json({
    success: true,
    upvotes: voteType === "up" ? 1 : 0,
    downvotes: voteType === "down" ? 1 : 0,
  })
}
