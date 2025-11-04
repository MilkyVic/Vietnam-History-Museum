export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-label">Khám phá giai đoạn</span>
        <h1 className="hero-title">
          <strong>Bảo tàng số</strong> 1975–1986
        </h1>
        <p className="hero-description">
          Bộ sưu tập tương tác về Việt Nam thời kỳ hậu thống nhất: từ khôi phục đất nước, vận hành cơ chế bao cấp
          đến những điều chỉnh dẫn tới Đổi mới 1986. Khám phá dữ kiện bằng bản đồ, dòng thời gian và trích dẫn chính
          thức từ nguồn Việt Nam, Mỹ và quốc tế.
        </p>
        <span className="hero-note">
          Hình ảnh minh họa sẽ được cập nhật khi hoàn tất rà soát và cấp phép tư liệu.
        </span>
      </div>
      <figure className="hero-figure">
        <img
          className="hero-image"
          src="/images/thoquenthoibaocap1.png"
          alt="Thời kỳ bao cấp (1975–1986)"
          draggable={false}
        />
        <figcaption className="hero-caption">
          Ảnh minh họa: Thời kỳ bao cấp (1975–1986).
        </figcaption>
      </figure>
    </section>
  );
}
