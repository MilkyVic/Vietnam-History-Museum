"Bảo tàng số 1954–1975" – website dòng thời gian và bản đồ sự kiện về cuộc kháng chiến chống Mỹ cứu nước. Khung dự án dùng [Next.js](https://nextjs.org) + Tailwind + React Leaflet.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Nội dung dữ liệu nằm tại `src/content/data.ts`.

- Thêm/sửa sự kiện trong `events` (id, slug, title, date, location, summary, sources).
- Nguồn tham khảo trong `sources` (id, title, url, year, perspective).

Trang chủ hiển thị bản đồ và dòng thời gian; trang chi tiết nằm ở `/events/[slug]`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI (stub)

API `POST /api/ask` hiện trả về 501. Để tích hợp RAG:

- Thêm kho tư liệu (PDF/TXT/Markdown) → trích xuất → nhúng vector (pgvector/Qdrant).
- Gọi OpenAI/LLM nội bộ để trả lời, bắt buộc trả kèm trích dẫn.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
