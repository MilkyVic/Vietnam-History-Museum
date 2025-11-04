import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "AI chưa được cấu hình. Thêm API key và tích hợp RAG để hỏi–đáp có trích dẫn.",
    },
    { status: 501 }
  );
}

