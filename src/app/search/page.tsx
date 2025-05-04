"use client";

import React, { useRef, useEffect, useState, FormEvent } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabaseClient";

// Extend Criminal to include the precomputed imageUrl
type Criminal = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;   
};

export default function SearchPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  // now storing the imageUrl on each record
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRange, setSelectedRange] = useState<number>(2);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize Google Map
  useEffect(() => {
    if (window.google && !map && mapRef.current) {
      const defaultCenter = { lat: 34.0135, lng: -118.281 };
      const newMap = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
      });
      setMap(newMap);
    }
  }, [map]);

  // Fetch criminals + geocode + take image_path directly
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("criminal_info")
        .select("id,name,address,image_path");
      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      const enriched = await Promise.all(
        data!.map(async (c) => {
          // geocode address → { lat, lng }
          const res = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: c.address }),
          });
          const { lat, lng } = await res.json();

          return {
            id: c.id,
            name: c.name,
            address: c.address,
            lat,
            lng,
            imageUrl: c.image_path,  // use DB URL
          } as Criminal;
        })
      );

      setCriminals(enriched.filter((c) => c.lat && c.lng));
    })();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchText || !window.google || !map) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchText }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) {
        alert("Address not found: " + status);
        return;
      }

      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(14);

      const radiusInMeters = selectedRange * 1609.34;

      // update or draw circle
      if (circle) {
        circle.setCenter(location);
        circle.setRadius(radiusInMeters);
      } else {
        const newCircle = new google.maps.Circle({
          map,
          center: location,
          radius: radiusInMeters,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });
        setCircle(newCircle);
      }

      // filter criminals in range
      const centreLatLng = new google.maps.LatLng(
        location.lat(),
        location.lng()
      );
      const inRange = criminals.filter((c) => {
        const pt = new google.maps.LatLng(c.lat, c.lng);
        const dist = google.maps.geometry.spherical.computeDistanceBetween(
          centreLatLng,
          pt
        );
        return dist <= radiusInMeters;
      });

      // Drop markers with image in InfoWindow
      inRange.forEach((c) => {
        const marker = new google.maps.Marker({
          map,
          position: { lat: c.lat, lng: c.lng },
          title: c.name,
        });

        const infoHtml = `
          <div style="
            background: #fff;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            max-width: 220px;
            font-family: Arial, sans-serif;
          ">
            <img
              src="${c.imageUrl}"
              onerror="this.src='/no-image.png'"
              style="width:100%;height:auto;object-fit:cover;border-radius:4px;margin-bottom:8px;"
            />
            <h3 style="margin:0 0 6px;font-size:1.1rem;color:#222;">${c.name}</h3>
            <p style="margin:0;font-size:0.9rem;color:#555;">${c.address}</p>
          </div>
        `;

        const infoWindow = new google.maps.InfoWindow({ content: infoHtml });
        marker.addListener("click", () =>
          infoWindow.open({ anchor: marker, map })
        );
      });
    });
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry`}
        strategy="beforeInteractive"
      />
      <div style={styles.pageContainer}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Crime Search</h1>
          <form onSubmit={handleSearch} style={styles.headerControls}>
            <input
              type="text"
              placeholder="Search by address..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Search
            </button>
            <div style={styles.rangeContainer}>
              <label style={styles.rangeLabel}>Range:</label>
              <select
                style={styles.rangeSelect}
                value={selectedRange}
                onChange={(e) => setSelectedRange(parseFloat(e.target.value))}
              >
                <option value={0.75}>0.75 miles</option>
                <option value={1}>1 mile</option>
                <option value={2}>2 miles</option>
                <option value={5}>5 miles</option>
              </select>
            </div>
          </form>
        </header>
        <main style={styles.mainContent}>
          <div ref={mapRef} style={styles.mapContainer} />
        </main>
      </div>
    </>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#111",
  },
  header: {
    width: "100%",
    backgroundColor: "#000",
    padding: "1rem",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
    color: "#fff",
  },
  headerControls: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    padding: "0.5rem",
    fontSize: "1rem",
    backgroundColor: "#222",
    color: "#eee",
    border: "1px solid #444",
  },
  searchButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  rangeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  rangeLabel: {
    color: "#fff",
    fontSize: "1rem",
  },
  rangeSelect: {
    padding: "0.5rem",
    fontSize: "1rem",
    backgroundColor: "#222",
    color: "#eee",
    border: "1px solid #444",
  },
  mainContent: {
    flexGrow: 1,
  },
  mapContainer: {
    width: "80%",
    margin: "1rem auto 2rem auto",
    minHeight: "800px",
    border: "1px solid #444",
  },
};
