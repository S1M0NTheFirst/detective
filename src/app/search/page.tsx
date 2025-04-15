"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function MapPage() {
  // A ref to the container element in which we will load the map.
  const mapRef = useRef<HTMLDivElement | null>(null);
  // State to hold the Google Map instance.
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    // Ensure the Google Maps object is available and the map is not already initialized.
    if (window.google && !map && mapRef.current) {
      // Set a default center (e.g., New York City). You can update with any lat/lng you prefer.
      const center = { lat: 40.7128, lng: -74.0060 };
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom: 12, // Adjust zoom level as needed
      });

      setMap(newMap);
    }
  }, [map]);

  return (
    <>
      {/*
        Load the Google Maps JavaScript API via Next.js' Script component.
        This script is loaded before interactive so that the `google` object is available when needed.
      */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="beforeInteractive"
      />

      {/* Container to display the map */}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
      />
    </>
  );
}
