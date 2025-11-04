export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-label">Khám phá thế giới của</span>
        <h1 className="hero-title">
          <strong>Bảo tàng số</strong> 1954–1975
        </h1>
        <p className="hero-description">
          Bộ sưu tập trưng bày trực tuyến về cuộc kháng chiến chống Mỹ cứu nước
          giai đoạn 1954–1975. Khám phá sự kiện qua bản đồ tương tác, dòng thời
          gian và tư liệu được trích dẫn từ nguồn Việt Nam, Mỹ và Quốc tế.
        </p>
        <span className="hero-note">
          Bộ chân dung nhân vật lịch sử sẽ bổ sung sau khi hoàn tất thẩm định và
          cấp phép tư liệu hình ảnh.
        </span>
      </div>
      <figure className="hero-figure">
        <img
          className="hero-image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Vietnam_1967_flickr-161616162.jpg/640px-Vietnam_1967_flickr-161616162.jpg"
          alt="Minh họa chiến tranh Việt Nam"
          draggable={false}
        />
        <figcaption className="hero-caption">
          Ảnh minh họa công khai: Wikimedia Commons (chỉ phục vụ trình diễn).
        </figcaption>
      </figure>
    </section>
  );
}
