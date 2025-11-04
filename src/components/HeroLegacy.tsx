export default function HeroLegacy() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-label">Khám phá thế giới của</span>
        <h1 className="hero-title">
          <strong>Bảo tàng số</strong> 1975-1986
        </h1>
        <p className="hero-description">
          Bộ sưu tập trực tuyến về cuộc kháng chiến chống Mỹ cứu nước giai đoạn 1975–1986. Người học có thể theo dõi sự kiện
          qua bản đồ tương tác, dòng thời gian và hệ thống tư liệu đã được trích dẫn rõ ràng.
        </p>
        <span className="hero-note">
          Bộ chân dung nhân vật lịch sử sẽ tiếp tục được bổ sung sau khi hoàn tất thẩm định và cấp phép tư liệu hình ảnh.
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
          
        </figcaption>
      </figure>
    </section>
  );
}
