"use client";

import React, { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin, ExternalLink, AlertCircle } from "lucide-react";

interface GoogleMapViewProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  className?: string;
  height?: string;
}

let isApiOptionsSet = false;

export default function GoogleMapView({
  latitude,
  longitude,
  address,
  className = "",
  height = "240px",
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";

  useEffect(() => {
    if (!hasCoordinates) return;

    if (!apiKey) {
      setMapLoadError("Google Maps API key not set.");
      return;
    }

    if (!mapRef.current) return;

    if (!isApiOptionsSet) {
      setOptions({
        key: apiKey,
        v: "weekly",
      });
      isApiOptionsSet = true;
    }

    let isSubscribed = true;

    async function initViewMap() {
      try {
        const { Map } = await importLibrary("maps");
        const { Marker } = await importLibrary("marker");

        if (!isSubscribed || !mapRef.current) return;

        const pos = { lat: latitude!, lng: longitude! };

        const map = new Map(mapRef.current, {
          center: pos,
          zoom: 16,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        googleMapInstance.current = map;

        const marker = new Marker({
          position: pos,
          map: map,
          title: address || "Application Property Location",
        });
        markerInstance.current = marker;

        // Add info window with address if provided
        if (address) {
          const { InfoWindow } = await importLibrary("maps");
          const infoWindow = new InfoWindow({
            content: `<div style="padding: 4px; font-family: sans-serif; font-size: 12px;"><strong>Property Location</strong><br/>${address}</div>`,
          });
          marker.addListener("click", () => {
            infoWindow.open({
              anchor: marker,
              map,
            });
          });
        }

        setIsLoaded(true);
      } catch (err: unknown) {
        if (isSubscribed) {
          console.error("Failed to load Google Map view:", err);
          setMapLoadError("Unable to load Google Map.");
        }
      }
    }

    initViewMap();

    return () => {
      isSubscribed = false;
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
      googleMapInstance.current = null;
    };
  }, [apiKey, latitude, longitude, address, hasCoordinates]);

  if (!hasCoordinates) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center ${className}`}>
        <MapPin className="h-6 w-6 text-gray-400 mb-1" />
        <p className="text-xs font-medium text-gray-600 font-onest">No Location Pinned</p>
        <p className="text-[11px] text-gray-400 font-onest">Applicant did not pin GPS coordinates.</p>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className={`flex flex-col gap-2 rounded-xl border border-[#D6D9DE] bg-white p-3 shadow-xs ${className}`}>
      {/* Header with Coordinates and External Link */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#0C83FF] shrink-0" />
          <span className="text-xs font-semibold text-[#343434] font-onest">Pinned Property Location</span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-semibold text-[#0C83FF] hover:underline font-onest cursor-pointer"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Map or Fallback View */}
      <div
        style={{ height }}
        className="relative w-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-gray-100"
      >
        {mapLoadError ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center">
            <AlertCircle className="h-6 w-6 text-amber-500 mb-1" />
            <p className="text-xs font-medium text-gray-700 font-onest">{mapLoadError}</p>
            <p className="text-[11px] text-gray-500 mt-1 font-mono">
              Coordinates: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 rounded bg-[#0C83FF] px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-600"
            >
              View on Google Maps <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <>
            <div ref={mapRef} className="h-full w-full" />
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent" />
                  <span className="text-xs text-gray-500 font-onest">Loading map...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Coordinate & Address Footer */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-500 font-onest">
        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
          Lat: {latitude?.toFixed(6)}, Lng: {longitude?.toFixed(6)}
        </span>
        {address && <span className="truncate max-w-[220px] italic">{address}</span>}
      </div>
    </div>
  );
}
