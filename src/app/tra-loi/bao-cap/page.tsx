"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Source = {
  name: string;
  url: string;
  note?: string;
};

type SectionSourceProps = {
  sources: Source[];
  showEvidence: boolean;
};

const steps = [
  "Bối cảnh tất yếu",
  "Mục tiêu & công cụ",
  "Kết quả & hạn chế",
  "Điều chỉnh 1981–1986",
  "Kết luận",
];

const contextSources: Source[] = [
  {
    name: "Văn kiện Đại hội IV của Đảng (1976)",
    url: "https://dangcongsan.vn/van-kien/dai-hoi/dai-hoi-iv",
  },
  {
    name: "Quốc hội Việt Nam khóa VI – Kỳ họp thứ nhất (1976)",
    url: "https://quochoi.vn/",
  },
  {
    name: "Vietnam Law Magazine – The centrally planned subsidized economy (1975–1986)",
    url: "https://vietnamlawmagazine.na.gov.vn/the-centrally-planned-subsidized-economy-1975-1986-4828.html",
  },
];

const toolCards = [
  {
    title: "Kế hoạch hóa tập trung",
    description:
      "Bộ máy kế hoạch thống nhất từ trung ương xuống địa phương, ấn định chỉ tiêu sản lượng, phân phối vốn – vật tư.",
    source: {
      name: "Văn kiện Đại hội IV",
      url: "https://dangcongsan.vn/van-kien/dai-hoi/dai-hoi-iv",
    },
  },
  {
    title: "Doanh nghiệp nhà nước & Quyết định 25-CP (1981)",
    description:
      "Quốc doanh giữ vai trò chủ đạo; QĐ 25-CP mở rộng quyền tự chủ hạch toán nhưng vẫn trong khuôn khổ kế hoạch.",
    source: {
      name: "Quyết định 25-CP (1981)",
      url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Quyet-dinh-25-CP-1981-mo-rong-quyen-tu-chu-xi-nghiep-quoc-doanh-44033.aspx",
    },
  },
  {
    title: "Khoán sản phẩm – Chỉ thị 100 (1981)",
    description:
      "Trao khoán đến nhóm và người lao động trong HTX nông nghiệp nhằm khuyến khích sản lượng lương thực.",
    source: {
      name: "Chỉ thị 100-CT/TW",
      url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Chi-thi-100-CT-TW-1981-khoan-san-pham-43959.aspx",
    },
  },
  {
    title: "Tem phiếu & phân phối bao cấp",
    description:
      "Hệ thống sổ gạo, tem phiếu bảo đảm nhu yếu phẩm tối thiểu cho cán bộ, công nhân viên và cư dân đô thị.",
    source: {
      name: "Vietnam Law Magazine (1975–1986)",
      url: "https://vietnamlawmagazine.na.gov.vn/the-centrally-planned-subsidized-economy-1975-1986-4828.html",
    },
  },
  {
    title: "Cải cách giá – lương – tiền (1985)",
    description:
      "Xóa bỏ hai giá, đổi tiền, trả lương bằng tiền nhằm chuẩn bị chuyển sang cơ chế hạch toán.",
    source: {
      name: "Ngân hàng Nhà nước – Tài liệu đổi tiền 1985",
      url: "https://www.sbv.gov.vn/",
    },
  },
];

const outcomeMetrics = [
  {
    indicator: "Tăng trưởng GDP (%)",
    values: { "1976": "11,0", "1980": "-3,5", "1985": "5,6" },
    note: "GSO – Niên giám thống kê",
  },
  {
    indicator: "Lương thực bình quân (kg/người)",
    values: { "1976": "215", "1980": "220", "1985": "271" },
    note: "Bộ NN&PTNT / Tổng cục Thống kê",
  },
  {
    indicator: "Lạm phát (CPI %, 1986)",
    values: { "1978": "12", "1982": "40", "1986": "453" },
    note: "Ngân hàng Nhà nước, GSO",
  },
  {
    indicator: "Năng suất lúa (tấn/ha)",
    values: { "1976": "2,2", "1980": "2,5", "1985": "3,2" },
    note: "FAO / GSO",
  },
];

const outcomeSources: Source[] = [
  {
    name: "GSO – Niên giám thống kê Việt Nam",
    url: "https://www.gso.gov.vn/du-lieu-va-so-lieu-thong-ke/",
  },
  {
    name: "Ngân hàng Nhà nước – Tư liệu cải cách giá lương tiền 1985",
    url: "https://www.sbv.gov.vn/",
  },
  {
    name: "FAOStat – Vietnam crop yield",
    url: "https://www.fao.org/faostat/en/#data/QCL",
  },
];

const issues = [
  "Cơ chế “xin – cho” trong phân bổ vật tư, vốn; doanh nghiệp nhà nước phụ thuộc ngân sách.",
  "Khan hiếm hàng hóa tiêu dùng, chợ đen phát triển ngoài kiểm soát.",
  "Hiệu quả sản xuất thấp, năng suất lao động tăng chậm, nợ đọng và bù lỗ lớn.",
];

const adjustments = [
  {
    title: "Khoán sản phẩm (Chỉ thị 100, 1981)",
    description:
      "Trao quyền cho hộ nông dân nhận khoán, ăn chia theo sản lượng ⇒ sản lượng lương thực tăng nhanh 1981–1984.",
    sources: [
      {
        name: "Chỉ thị 100-CT/TW",
        url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Chi-thi-100-CT-TW-1981-khoan-san-pham-43959.aspx",
      },
    ],
  },
  {
    title: "Quyền tự chủ xí nghiệp (QĐ 25-CP, 1981)",
    description:
      "Cho phép doanh nghiệp tự cân đối vật tư, trả lương theo hiệu quả; mở đường cho cơ chế hạch toán kinh doanh.",
    sources: [
      {
        name: "Quyết định 25-CP (1981)",
        url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Quyet-dinh-25-CP-1981-mo-rong-quyen-tu-chu-xi-nghiep-quoc-doanh-44033.aspx",
      },
    ],
  },
  {
    title: "Điều chỉnh giá – lương – tiền (1985)",
    description:
      "Đổi tiền, một giá trong hệ thống, trả lương bằng tiền để chuẩn bị chuyển đổi cơ chế; tuy nhiên lạm phát tăng cao.",
    sources: [
      {
        name: "Ngân hàng Nhà nước – Tư liệu đổi tiền 1985",
        url: "https://www.sbv.gov.vn/",
      },
    ],
  },
  {
    title: "Kết luận Bộ Chính trị 8-1986",
    description:
      "Khẳng định cần đổi mới cơ chế quản lý, thừa nhận nhiều thành phần kinh tế – bước đệm cho Đại hội VI.",
    sources: [
      {
        name: "Kết luận Bộ Chính trị (8/1986)",
        url: "https://dangcongsan.vn/van-kien/bo-chinh-tri-ban-bi-thu",
      },
    ],
  },
];

const conclusionSources: Source[] = [
  {
    name: "Văn kiện Đại hội V (1982)",
    url: "https://dangcongsan.vn/van-kien/dai-hoi/dai-hoi-v",
  },
  {
    name: "Văn kiện Đại hội VI (1986)",
    url: "https://dangcongsan.vn/van-kien/dai-hoi/dai-hoi-vi",
  },
];

const sectionSourceBuckets: Source[][] = [
  contextSources,
  toolCards.map((card) => card.source),
  outcomeSources,
  adjustments.flatMap((a) => a.sources),
  conclusionSources,
];

const allSources = sectionSourceBuckets.flat().filter(Boolean);

const topFiveSources = Array.from(
  new Map(allSources.map((s) => [s.url, s])).values()
).slice(0, 5);

function SourceToggle({ sources, showEvidence }: SectionSourceProps) {
  const [open, setOpen] = useState(false);
  const expanded = open || showEvidence;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white"
      >
        Nguồn
      </button>
      {expanded && (
        <ul className="mt-3 space-y-2 text-sm text-gray-300">
          {sources.map((source) => (
            <li key={source.url} className="flex gap-2">
              <span>•</span>
              <Link
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {source.name}
              </Link>
              {source.note && <span className="text-xs text-gray-500">({source.note})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BaoCapAnswerPage() {
  const [showEvidence, setShowEvidence] = useState(false);

  const progressWidth = useMemo(() => `${(steps.length / steps.length) * 100}%`, []);

  return (
    <div className="section">
      <header className="mb-10 space-y-4">
        <span className="hero-label">Chủ đề thảo luận</span>
        <h1 className="hero-title">Cơ chế kinh tế bao cấp sau 1975: sai lầm hay tất yếu?</h1>
        <p className="hero-description">
          Trang trả lời lập luận nhiều bước, kết nối dữ kiện chính thức giai đoạn 1975–1986 để cân nhắc việc áp dụng cơ chế
          bao cấp trên phạm vi cả nước. Mỗi phần đều đi kèm nguồn gốc minh chứng chuẩn.
        </p>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
          <span>Lược đồ lập luận</span>
          <label className="flex items-center gap-2 text-[0.65rem]">
            <input
              type="checkbox"
              checked={showEvidence}
              onChange={(event) => setShowEvidence(event.target.checked)}
              className="h-3 w-3 accent-[#b5964d]"
            />
            Xem minh chứng
          </label>
        </div>
        <div className="mt-3">
          <div className="relative mb-3 h-1 rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 rounded-full bg-[#b5964d]" style={{ width: progressWidth }} />
          </div>
          <div className="grid grid-cols-1 gap-3 text-xs text-gray-300 sm:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#b5964d] text-[0.7rem] text-[#b5964d]">
                  {index + 1}
                </span>
                <span className="uppercase tracking-[0.2em]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="section-heading">Bối cảnh tất yếu (1975–1977)</h2>
        <p className="copy-block">
          Sau đại thắng mùa Xuân 1975, Việt Nam phải hàn gắn hậu quả chiến tranh, đối mặt cấm vận kinh tế, thiếu vốn – vật tư và
          nhu cầu thống nhất quản lý giữa hai miền. Trong điều kiện đó, việc mở rộng cơ chế kế hoạch hóa tập trung – bao cấp từng
          giúp miền Bắc duy trì kháng chiến được xem là giải pháp khả thi nhất để phân bổ nguồn lực khan hiếm và bảo đảm an sinh tối thiểu.
        </p>
        <ul className="copy-block list-disc space-y-2 pl-6 text-sm text-gray-300">
          <li>Văn kiện Đại hội IV (12/1976) xác định nhiệm vụ “thống nhất quản lý kinh tế, đẩy mạnh công nghiệp hóa xã hội chủ nghĩa”.</li>
          <li>Quốc hội khóa VI (6/1976) hợp nhất bộ máy nhà nước, tạo cơ sở pháp lý cho một nền kinh tế thống nhất.</li>
          <li>Cổng thông tin Chính phủ ghi nhận nền kinh tế 1975–1977 vẫn chủ yếu dựa vào phân phối theo kế hoạch do thiếu ngoại tệ, viện trợ.</li>
        </ul>
        <SourceToggle sources={contextSources} showEvidence={showEvidence} />
      </section>

      <section className="section">
        <h2 className="section-heading">Mục tiêu & công cụ của cơ chế bao cấp</h2>
        <p className="copy-block">
          Đảng và Nhà nước đặt mục tiêu xây dựng nền kinh tế xã hội chủ nghĩa thống nhất, nhanh chóng khôi phục sản xuất, ưu tiên
          công nghiệp nặng, bảo đảm nhu yếu phẩm và an sinh lao động. Các công cụ chính gồm kế hoạch hóa tập trung, doanh nghiệp
          nhà nước chủ đạo, hợp tác xã nông nghiệp và hệ thống tem phiếu; đến đầu thập niên 1980 xuất hiện các biện pháp khoán sản
          phẩm và cải cách giá – lương để tháo gỡ khó khăn tích tụ.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {toolCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-lg shadow-black/30">
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{card.description}</p>
              <div className="mt-4 text-xs uppercase tracking-[0.3em] text-gray-400">Đọc văn bản gốc</div>
              <Link
                href={card.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-2 text-sm text-[#b5964d] underline-offset-2 hover:underline"
              >
                {card.source.name}
              </Link>
            </div>
          ))}
        </div>
        <SourceToggle
          sources={toolCards.map((card) => card.source)}
          showEvidence={showEvidence}
        />
      </section>

      <section className="section">
        <h2 className="section-heading">Kết quả & hạn chế (1978–1986)</h2>
        <p className="copy-block">
          Cơ chế bao cấp giúp duy trì phân phối tối thiểu, sản lượng lương thực tăng nhờ khoán sản phẩm; song nền kinh tế vẫn rơi vào
          trì trệ do hiệu quả thấp, khan hiếm hàng hóa và lạm phát leo thang, nhất là sau cải cách giá – lương – tiền năm 1985.
        </p>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          <table className="w-full text-sm text-gray-200">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Chỉ báo</th>
                <th className="px-4 py-3 text-right">1976</th>
                <th className="px-4 py-3 text-right">1980</th>
                <th className="px-4 py-3 text-right">1985</th>
              </tr>
            </thead>
            <tbody>
              {outcomeMetrics.map((metric) => (
                <tr key={metric.indicator} className="border-t border-white/5">
                  <td className="px-4 py-3 text-left text-white">{metric.indicator}</td>
                  <td className="px-4 py-3 text-right">{metric.values["1976"] ?? "-"}</td>
                  <td className="px-4 py-3 text-right">{metric.values["1980"] ?? metric.values["1978"] ?? metric.values["1982"] ?? "-"}</td>
                  <td className="px-4 py-3 text-right">{metric.values["1985"] ?? metric.values["1986"] ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="copy-block">
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-gray-300">Các vấn đề nổi bật</h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-gray-300">
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
        <SourceToggle sources={outcomeSources} showEvidence={showEvidence} />
      </section>

      <section className="section">
        <h2 className="section-heading">Các điều chỉnh từ thực tiễn (1981–1986)</h2>
        <p className="copy-block">
          Trước sức ép thực tiễn, Đảng và Nhà nước từng bước đổi mới tư duy quản lý: khoán sản phẩm tới hộ nông dân, giao quyền
          hạch toán cho doanh nghiệp, điều chỉnh giá – lương – tiền và chuẩn bị luận cứ cho Đổi mới 1986.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {adjustments.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-lg shadow-black/30">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{item.description}</p>
              <div className="mt-4 text-xs uppercase tracking-[0.3em] text-gray-400">Nguồn</div>
              <ul className="mt-2 space-y-1 text-sm text-[#b5964d]">
                {item.sources.map((source) => (
                  <li key={source.url}>
                    <Link href={source.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                      {source.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <SourceToggle sources={adjustments.flatMap((a) => a.sources)} showEvidence={showEvidence} />
      </section>

      <section className="section">
        <h2 className="section-heading">Kết luận cân bằng, có điều kiện</h2>
        <div className="copy-block space-y-3">
          <p>
            Cơ chế bao cấp sau 1975 là lựa chọn <strong>tất yếu trong ngắn hạn</strong>: nó giúp Việt Nam thống nhất quản lý, huy động nguồn
            lực khan hiếm và bảo đảm an sinh khi đất nước vừa ra khỏi chiến tranh, bị cô lập và thiếu vốn.
          </p>
          <p>
            Sai lầm nằm ở việc <strong>duy trì kéo dài và cứng nhắc</strong>, chậm thích ứng với thay đổi của sản xuất và thị trường, dẫn đến trì trệ,
            lạm phát và nhu cầu bức bách phải đổi mới. Đổi mới 1986 vì vậy trở thành bước tất yếu kế tiếp để chuyển sang cơ chế thị trường
            có sự quản lý của Nhà nước.
          </p>
          <p>
            Nhìn lại, kinh tế bao cấp không phải lựa chọn sai ngay từ đầu, mà là giải pháp lịch sử hợp lý trong điều kiện đặc biệt – vấn đề nằm
            ở tốc độ chuyển đổi sang cơ chế linh hoạt hơn.
          </p>
        </div>
        <SourceToggle sources={conclusionSources} showEvidence={showEvidence} />
      </section>

      <section className="section">
        <h2 className="section-heading">Top 5 trích dẫn đã sử dụng</h2>
        <ol className="copy-block list-decimal space-y-2 pl-6 text-sm text-gray-300">
          {topFiveSources.map((source) => (
            <li key={source.url}>
              <Link href={source.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                {source.name}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

