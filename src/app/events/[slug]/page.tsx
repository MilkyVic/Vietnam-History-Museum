import { data } from "@/content/data";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return data.events.map((e) => ({ slug: e.slug }));
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = data.events.find((e) => e.slug === slug);
  if (!event) return notFound();
  const sources = data.sources.filter((s) => event.sources.includes(s.id));

  return (
    <div className="grid gap-4">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Quay lại
      </Link>
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <div className="text-sm text-gray-600">
        {new Date(event.date).toLocaleDateString("vi-VN")} – {event.location?.name}
      </div>
      <p className="text-base">{event.summary}</p>
      {event.body && (
        <article className="prose max-w-none">
          <p>{event.body}</p>
        </article>
      )}

      {sources.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Tư liệu tham khảo</h2>
          <ul className="list-disc ps-5 text-sm">
            {sources.map((s) => (
              <li key={s.id} className="mb-1">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {s.title}
                </a>{" "}
                <span className="text-gray-600">
                  {s.publisher ? `– ${s.publisher}` : ""}
                  {s.year ? `, ${s.year}` : ""}
                  {s.perspective ? ` • ${s.perspective}` : ""}
                </span>
                {s.quote && (
                  <div className="text-gray-700">“{s.quote}”</div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

