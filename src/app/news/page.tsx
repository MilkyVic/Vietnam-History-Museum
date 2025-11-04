export default function NewsPage() {
  const items = [
    {
      title: "Ra mắt chuyên đề: Tư liệu Hiệp định Paris (1973)",
      date: "2025-05-01",
      summary:
        "Bổ sung trích dẫn và đường dẫn tới bản số hoá các văn kiện, báo chí quốc tế liên quan Hiệp định Paris.",
    },
    {
      title: "Cập nhật bản đồ chiến dịch 1975",
      date: "2025-04-10",
      summary:
        "Bổ sung các mốc tiến quân và liên kết tới nguồn ảnh tư liệu công khai (Wikimedia Commons, NARA).",
    },
  ];

  return (
    <div className="section">
      <h1 className="page-heading">Tin tức</h1>
      <p className="page-subtitle">Cập nhật hoạt động và tư liệu mới nhất của bảo tàng số</p>
      <div className="card-grid">
        {items.map((n) => (
          <article key={n.title} className="card">
            <div className="card-date">
              {new Date(n.date).toLocaleDateString("vi-VN")}
            </div>
            <h2 className="card-title">{n.title}</h2>
            <p className="card-summary">{n.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
