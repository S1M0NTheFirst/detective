"use client";

import React, { useRef, useEffect, useState, FormEvent } from "react";
import Script from "next/script";

export default function SearchPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [searchText, setSearchText] = useState("");

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize the map once the Google Maps API script is available.
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

  // Function to perform search using the Google Geocoder.
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!searchText || !window.google || !map) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchText }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(14);

        // Update or create marker.
        if (marker) {
          marker.setPosition(location);
        } else {
          const newMarker = new google.maps.Marker({
            map,
            position: location,
            animation: google.maps.Animation.DROP,
          });
          setMarker(newMarker);
        }

        // Calculate radius in meters (5 miles ≈ 8046.7 meters).
        const radiusInMeters = 5 * 1609.34;
        
        // Update or create the circle overlay.
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
      } else {
        alert("Address not found: " + status);
      }
    });
  };

  return (
    <>
      {/* Load Google Maps JavaScript API */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`}
        strategy="beforeInteractive"
      />

      {/* Page Container */}
      <div style={styles.pageContainer}>
        {/* Header Section */}
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
            <select style={styles.filterSelect}>
              <option value="">Filter by crime type</option>
              <option value="theft">Theft</option>
              <option value="assault">Assault</option>
              <option value="fraud">Fraud</option>
              {/* Add more options as needed */}
            </select>
          </form>
        </header>

        {/* Main Content */}
        <main style={styles.mainContent}>
          <div ref={mapRef} style={styles.mapContainer}>
            {/* The Google Map will be rendered here */}
          </div>
        </main>
      </div>
    </>
  );
}

// Inline styles with a "secret agent" dark theme.
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#111", // Dark background
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
  filterSelect: {
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
