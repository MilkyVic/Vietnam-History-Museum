import MapView from "@/components/MapView";
import Timeline from "@/components/Timeline";
import { data } from "@/content/data";

export default function LocationPage() {
  const events = data.events;
  const sources = data.sources;
  return (
    <div className="section">
      <h1 className="page-heading">Địa điểm</h1>
      
      <section>
        <h2 className="section-heading">Bản đồ sự kiện</h2>
        <MapView events={events} height={420} />
      </section>
      <section className="section">
        <h2 className="section-heading">Dòng thời gian</h2>
        <Timeline events={events} sources={sources} />
      </section>
    </div>
  );
}
