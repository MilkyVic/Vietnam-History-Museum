import Link from "next/link";

const topics = [
  {
    slug: "/tra-loi/bao-cap",
    title: "Cơ chế kinh tế bao cấp sau 1975: sai lầm hay tất yếu?",
    summary:
      "Khảo sát toàn diện bối cảnh 1975–1986, mục tiêu – công cụ của cơ chế bao cấp, kết quả và những điều chỉnh dẫn đến Đổi mới 1986.",
    tags: ["1975–1986", "Kinh tế", "Bao cấp"],
    sources: 5,
  },
];

export default function DiscussionListPage() {
  return (
    <div className="section">
      <header className="mb-10 space-y-3">
        <span className="hero-label">Không gian thảo luận</span>
        <p className="hero-description">
          Các chủ đề được biên soạn theo cấu trúc lập luận nhiều bước, đi kèm bộ nguồn minh chứng chính thức. Chọn một chủ đề để xem
          toàn bộ dữ liệu, biểu đồ và kết luận cân bằng.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {topics.map((topic) => (
          <article
            key={topic.slug}
            className="rounded-3xl border border-white/12 bg-black/30 p-6 shadow-lg shadow-black/30 transition hover:border-[#b5964d]"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Chủ đề</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">{topic.title}</h2>
            <p className="mt-4 text-sm text-gray-300">{topic.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">
              {topic.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-gray-300">
                  {tag}
                </span>
              ))}
              <span className="rounded-full border border-white/10 px-3 py-1 text-gray-300">
                {topic.sources} nguồn dẫn
              </span>
            </div>
            <Link
              href={topic.slug}
              className="mt-6 inline-flex items-center gap-2 text-sm text-[#b5964d] underline-offset-2 hover:underline"
            >
              Xem lập luận chi tiết →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

