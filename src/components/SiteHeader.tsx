import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        <span className="logo-mark" />
        <span className="logo-text">
          <small>Bảo tàng số</small>
          <span>1975–1986</span>
        </span>
      </Link>
      <nav className="site-nav">
        <Link href="/tin-tuc">Tin tức</Link>
        <Link href="/gioi-thieu">Giới thiệu</Link>
        <Link href="/thao-luan">Thảo luận</Link>
        <Link href="/dia-diem">Địa điểm</Link>
        <Link href="/chatbot">Chatbot</Link>
      </nav>
    </header>
  );
}

