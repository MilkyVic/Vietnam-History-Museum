import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, ExternalLink, Info } from "lucide-react";
import BarChart
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

/**
 * Answer Mode — “Bao cấp 1975–1986: sai lầm hay tất yếu?”
 * -------------------------------------------------------
 * • Trang đơn có thể dùng cho Next.js (App Router) hoặc CRA.
 * • Dùng Tailwind + shadcn/ui + recharts.
 * • Thay thế các nguồn (url) bằng link chính thức của nhóm.
 * • Toàn bộ dữ liệu được nhúng mẫu để chạy offline.
 */

// ======= DATA LAYER ==========================================================

// Progress steps for the argument
const STEPS = [
  { id: 1, label: "Bối cảnh tất yếu" },
  { id: 2, label: "Mục tiêu & công cụ" },
  { id: 3, label: "Kết quả & hạn chế" },
  { id: 4, label: "Điều chỉnh 1981–1986" },
  { id: 5, label: "Kết luận cân bằng" },
];

// Minimal datasets — swap with your CSV fetch if needed
const gdpGrowth = [
  { year: 1975, value: 2.0 },
  { year: 1976, value: 11.0 },
  { year: 1977, value: 13.6 },
  { year: 1978, value: 4.0 },
  { year: 1979, value: 2.3 },
  { year: 1980, value: -3.5 },
  { year: 1981, value: 2.8 },
  { year: 1982, value: 6.0 },
  { year: 1983, value: 5.5 },
  { year: 1984, value: 6.2 },
  { year: 1985, value: 5.6 },
  { year: 1986, value: 3.4 },
];

const cpi = [
  { year: 1978, value: 12 },
  { year: 1979, value: 15 },
  { year: 1980, value: 25 },
  { year: 1981, value: 35 },
  { year: 1982, value: 40 },
  { year: 1983, value: 50 },
  { year: 1984, value: 70 },
  { year: 1985, value: 50 },
  { year: 1986, value: 453 },
];

// Policy events to render under charts / timeline ticks
const policyEvents = [
  {
    year: 1976,
    title: "Đại hội IV – đường lối CNH XHCN",
    source: {
      name: "Văn kiện ĐH IV",
      url: "https://dangcongsan.vn/van-kien",
      kind: "PARTY",
    },
  },
  {
    year: 1981,
    title: "Chỉ thị 100 – Khoán sản phẩm",
    source: {
      name: "Chỉ thị 100/CT-TW (1981)",
      url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Chi-thi-100-CT-TW-1981-khoan-san-pham/",
      kind: "PARTY",
    },
  },
  {
    year: 1981,
    title: "QĐ 25-CP – Quyền tự chủ xí nghiệp quốc doanh",
    source: {
      name: "Quyết định 25-CP (1981)",
      url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Quyet-dinh-25-CP-1981-mo-rong-quyen-tu-chu-xi-nghiep/",
      kind: "GOV",
    },
  },
  {
    year: 1985,
    title: "Cải cách giá–lương–tiền",
    source: {
      name: "Tư liệu NHNN về đổi tiền 1985",
      url: "https://www.sbv.gov.vn/",
      kind: "GOV",
    },
  },
  {
    year: 1986,
    title: "Đại hội VI – Đổi mới",
    source: {
      name: "Văn kiện ĐH VI",
      url: "https://dangcongsan.vn/van-kien",
      kind: "PARTY",
    },
  },
];

// Claims following the pattern: claim → evidence → sources
const claims = [
  {
    id: "context",
    title: "Bối cảnh tất yếu",
    body:
      "Sau 1975: hậu chiến nặng nề, cấm vận, thiếu vốn – vật tư, hai miền vừa thống nhất → nhu cầu thống nhất quản lý, phân phối tối thiểu và khôi phục sản xuất.",
    sources: [
      { name: "vietnam.gov.vn – Economy (1975–1986)", url: "https://vietnam.gov.vn/economy-68968" },
      { name: "Quốc hội khóa VI – Kỳ họp I (1976)", url: "https://quochoi.vn/" },
    ],
  },
  {
    id: "tools",
    title: "Mục tiêu & công cụ",
    body:
      "Mở rộng kế hoạch hoá tập trung, quốc doanh chủ đạo, HTX nông nghiệp, tem phiếu; điều chỉnh bằng CT100 (khoán) và QĐ 25-CP (tự chủ xí nghiệp); cải cách giá–lương–tiền 1985.",
    sources: [
      { name: "Chỉ thị 100/CT-TW (1981)", url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Chi-thi-100-CT-TW-1981-khoan-san-pham/" },
      { name: "Quyết định 25-CP (1981)", url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Quyet-dinh-25-CP-1981-mo-rong-quyen-tu-chu-xi-nghiep/" },
      { name: "NHNN – tư liệu cải cách 1985", url: "https://www.sbv.gov.vn/" },
    ],
  },
  {
    id: "outcomes",
    title: "Kết quả & hạn chế",
    body:
      "Khôi phục một phần sản xuất và an sinh, nhưng động lực thấp, 'xin–cho', khan hiếm, thị trường ngầm; lạm phát tăng cao 1985–1986.",
    evidence: [
      { type: "stat", label: "CPI 1986 rất cao (ước)", value: 453, unit: "%" },
      { type: "stat", label: "GDP growth 1980", value: -3.5, unit: "%" },
    ],
    sources: [
      { name: "Niên giám Thống kê (GSO)", url: "https://www.gso.gov.vn/" },
      { name: "vietnam.gov.vn – Economy", url: "https://vietnam.gov.vn/economy-68968" },
    ],
  },
  {
    id: "adjust",
    title: "Điều chỉnh 1981–1986",
    body:
      "Khoán sản phẩm (CT100), mở quyền hạch toán, thí điểm giá theo thị trường giúp nâng năng suất nông nghiệp và tạo tiền đề đổi mới.",
    sources: [
      { name: "Chỉ thị 100/CT-TW (1981)", url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Chi-thi-100-CT-TW-1981-khoan-san-pham/" },
    ],
  },
  {
    id: "conclusion",
    title: "Kết luận cân bằng",
    body:
      "Bao cấp là lựa chọn có tính tất yếu lịch sử trong bối cảnh hậu chiến để ổn định xã hội và huy động nguồn lực khan hiếm; ‘sai lầm’ (nếu dùng từ này) nằm ở việc duy trì kéo dài và quản lý cứng nhắc, chậm chuyển sang cơ chế thị trường có quản lý. Đổi mới 1986 là bước tất yếu kế tiếp.",
    sources: [
      { name: "Văn kiện ĐH VI (1986)", url: "https://dangcongsan.vn/van-kien" },
    ],
  },
];

// ======= UI HELPERS ==========================================================

const SourceBadge = ({ kind }) => {
  const map = {
    GOV: "bg-emerald-100 text-emerald-800",
    PARTY: "bg-amber-100 text-amber-800",
    NA: "bg-sky-100 text-sky-800",
    GSO: "bg-purple-100 text-purple-800",
    ACAD: "bg-zinc-100 text-zinc-800",
  };
  return <span className={`px-2 py-0.5 text-xs rounded ${map[kind] || "bg-zinc-100"}`}>{kind || "SRC"}</span>;
};

const SourceList = ({ sources }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {sources?.map((s, i) => (
      <a key={i} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline decoration-dotted">
        <ExternalLink className="h-3 w-3" /> {s.name}
      </a>
    ))}
  </div>
);

const EvidenceShow = ({ evidence }) => (
  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
    {(evidence || []).map((e, i) => (
      <div key={i} className="rounded-xl border p-3 text-sm">
        <div className="font-medium">{e.label}</div>
        {e.type === "stat" && (
          <div className="text-2xl font-bold">{e.value}{e.unit}</div>
        )}
      </div>
    ))}
  </div>
);

// ======= MAIN COMPONENT ======================================================

export default function AnswerModeBaoCap() {
  const [step, setStep] = useState(5); // default show all completed
  const progress = useMemo(() => (step / STEPS.length) * 100, [step]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bao cấp 1975–1986: sai lầm hay tất yếu?</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Chế độ kế hoạch hóa tập trung – bao cấp sau 1975 được triển khai để thống nhất quản lý, khôi phục sản xuất và bảo đảm an sinh trong bối cảnh hậu chiến. Trang này tổng hợp lập luận theo cấu trúc <strong>claim → evidence → source</strong> và trực quan hóa dữ liệu để hỗ trợ kết luận.
        </p>
      </header>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Tiến độ lập luận</div>
          <div className="text-xs text-muted-foreground">Bước {step}/{STEPS.length}</div>
        </div>
        <Progress value={progress} />
        <div className="flex flex-wrap gap-2 mt-3">
          {STEPS.map((s) => (
            <Button key={s.id} variant={step === s.id ? "default" : "secondary"} size="sm" onClick={() => setStep(s.id)}>
              {s.id < step ? <Check className="h-3 w-3 mr-1" /> : null}
              {s.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setStep(5)}>Hiển thị tất cả</Button>
        </div>
      </div>

      {/* Step 1: Context */}
      {(step === 1 || step === 5) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1) Bối cảnh tất yếu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{claims.find(c => c.id === "context").body}</p>
            <SourceList sources={claims.find(c => c.id === "context").sources} />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Tools */}
      {(step === 2 || step === 5) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2) Mục tiêu & công cụ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{claims.find(c => c.id === "tools").body}</p>
            {/* Policy pills */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {policyEvents.map((p, i) => (
                <div key={i} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{p.year} • {p.title}</div>
                    <SourceBadge kind={p.source.kind} />
                  </div>
                  <a href={p.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline mt-1">
                    <ExternalLink className="h-3 w-3" /> {p.source.name}
                  </a>
                </div>
              ))}
            </div>
            <SourceList sources={claims.find(c => c.id === "tools").sources} />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Outcomes with charts */}
      {(step === 3 || step === 5) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3) Kết quả & hạn chế (kèm biểu đồ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-sm mb-2 font-medium">Tăng trưởng GDP hàng năm (%)</div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gdpGrowth} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tickFormatter={(v)=>String(v)} />
                      <YAxis domain={[Math.min(...gdpGrowth.map(d=>d.value))-2, Math.max(...gdpGrowth.map(d=>d.value))+2]} />
                      <Tooltip formatter={(v) => [`${v}%`, "Tăng trưởng"]} labelFormatter={(l)=>`Năm ${l}`} />
                      <Line type="monotone" dataKey="value" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Nguồn gợi ý: GSO/World Bank (ghi rõ bảng & trang trong bản chính thức).</p>
              </div>

              <div>
                <div className="text-sm mb-2 font-medium">Lạm phát (CPI, % năm)</div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpi} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(v) => [`${v}%`, "Lạm phát"]} labelFormatter={(l)=>`Năm ${l}`} />
                      <Area type="monotone" dataKey="value" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Chú thích phạm vi chuỗi; nếu thiếu năm, ghi “ước tính” và trích dẫn rõ.</p>
              </div>
            </div>

            <EvidenceShow evidence={claims.find(c => c.id === "outcomes").evidence} />
            <SourceList sources={claims.find(c => c.id === "outcomes").sources} />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Adjustments */}
      {(step === 4 || step === 5) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4) Các điều chỉnh 1981–1986</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{claims.find(c => c.id === "adjust").body}</p>
            <div className="rounded-xl border p-3 mt-3 text-sm bg-muted/30 flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5" />
              <p>
                Gợi ý trình bày: kèm một biểu đồ nhỏ về sản lượng lương thực hoặc năng suất lúa trước/ sau Chỉ thị 100 để cho thấy tác động trực tiếp từ thay đổi cơ chế.
              </p>
            </div>
            <SourceList sources={claims.find(c => c.id === "adjust").sources} />
          </CardContent>
        </Card>
      )}

      {/* Step 5: Conclusion */}
      {(step === 5) && (
        <Card className="mb-6 border-2">
          <CardHeader>
            <CardTitle>5) Kết luận cân bằng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-lg">{claims.find(c => c.id === "conclusion").body}</p>
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Nguồn đã dùng trong trang</div>
              <SourceList sources={[
                { name: "vietnam.gov.vn – Economy", url: "https://vietnam.gov.vn/economy-68968" },
                { name: "Văn kiện ĐH IV/V/VI", url: "https://dangcongsan.vn/van-kien" },
                { name: "Quốc hội khóa VI (1976)", url: "https://quochoi.vn/" },
                { name: "Chỉ thị 100/CT-TW (1981)", url: "https://thuvienphapluat.vn/van-ban/Thuong-mai/Chi-thi-100-CT-TW-1981-khoan-san-pham/" },
                { name: "Niên giám Thống kê (GSO)", url: "https://www.gso.gov.vn/" },
              ]} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer notice */}
      <p className="text-xs text-muted-foreground mt-6">
        *Mẫu này dùng dữ liệu minh hoạ. Khi đưa vào sản phẩm chính thức, hãy thay thế link bằng nguồn Chính phủ/Đảng/Quốc hội/NHNN/GSO và ghi rõ bảng, trang, thời điểm truy cập.
      </p>
    </div>
  );
}
