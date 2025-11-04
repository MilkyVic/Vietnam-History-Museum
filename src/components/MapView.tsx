"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { EventItem } from "@/types";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

// react-leaflet needs to be loaded client-side only
const MapContainer: any = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer: any = dynamic(async () => (await import("react-leaflet")).TileLayer, {
  ssr: false,
});
const Marker: any = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
const Popup: any = dynamic(async () => (await import("react-leaflet")).Popup, { ssr: false });

type Props = {
  events: EventItem[];
  height?: number;
};

export default function MapView({ events, height = 420 }: Props) {
  const [zoom] = useState(4);
  const [starIcon, setStarIcon] = useState<any>();
  const markers = useMemo(() => events.filter((e) => !!e.location), [events]);
  const center = useMemo(() => {
    // Rough center for Vietnam
    return [16.0471, 108.206] as [number, number];
  }, []);

  useEffect(() => {
    let isMounted = true;
    import("leaflet").then((L) => {
      if (!isMounted) return;
      setStarIcon(
        L.divIcon({
          className: "star-marker",
          html: "★",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
      );
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="map-panel">
      <div style={{ height }}>
        <MapContainer center={center} zoom={zoom} className="leaflet-map">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            attribution='Map tiles by <a href="https://carto.com/attributions">CARTO</a>, data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {starIcon &&
            markers.map((e) => (
              <Marker
                key={e.id}
                position={[e.location!.lat, e.location!.lng]}
                icon={starIcon}
              >
                <Popup>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{e.title}</div>
                    <div className="muted-text">{e.location!.name}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
