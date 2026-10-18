"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin, Navigation, X, AlertCircle } from "lucide-react";

interface GoogleMapLocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (coords: { latitude: number | null; longitude: number | null }) => void;
  error?: string;
}

const DEFAULT_CENTER = {
  lat: 24.5925, // Mount Abu coordinates
  lng: 72.7156,
};
const DEFAULT_ZOOM = 14;

let isApiOptionsSet = false;

export default function GoogleMapLocationPicker({
  latitude,
  longitude,
  onChange,
  error,
}: GoogleMapLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Helper to place / move marker
  const setMarkerPosition = useCallback(
    async (lat: number, lng: number, map: google.maps.Map, pan: boolean = true) => {
      const pos = { lat, lng };

      if (!markerInstance.current) {
        const { Marker } = await importLibrary("marker");
        if (!mapRef.current) return;

        markerInstance.current = new Marker({
          position: pos,
          map: map,
          draggable: true,
          title: "Pinned Property Location",
        });

        markerInstance.current.addListener("dragend", () => {
          const newPos = markerInstance.current?.getPosition();
          if (newPos) {
            const newLat = parseFloat(newPos.lat().toFixed(6));
            const newLng = parseFloat(newPos.lng().toFixed(6));
            onChange({ latitude: newLat, longitude: newLng });
          }
        });
      } else {
        markerInstance.current.setPosition(pos);
      }

      if (pan) {
        map.panTo(pos);
      }
    },
    [onChange]
  );

  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey) {
      setMapLoadError("Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.");
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

    async function initMap() {
      try {
        const { Map } = await importLibrary("maps");
        if (!isSubscribed || !mapRef.current) return;

        const initialCenter =
          latitude && longitude
            ? { lat: latitude, lng: longitude }
            : DEFAULT_CENTER;
        const initialZoom = latitude && longitude ? 16 : DEFAULT_ZOOM;

        const map = new Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        googleMapInstance.current = map;

        // If coordinates already exist, place the marker
        if (latitude && longitude) {
          await setMarkerPosition(latitude, longitude, map, false);
        }

        // Click on map to place or move marker
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const lat = parseFloat(e.latLng.lat().toFixed(6));
          const lng = parseFloat(e.latLng.lng().toFixed(6));
          setMarkerPosition(lat, lng, map, false);
          onChange({ latitude: lat, longitude: lng });
          setGpsError(null);
        });

        setIsLoaded(true);
      } catch (err: unknown) {
        if (isSubscribed) {
          console.error("Failed to load Google Maps:", err);
          setMapLoadError("Unable to load Google Maps. Please check your API key or network connection.");
        }
      }
    }

    initMap();

    return () => {
      isSubscribed = false;
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
      googleMapInstance.current = null;
    };
  }, [apiKey]); // Run once on mount

  // Sync marker position if props change externally
  useEffect(() => {
    if (googleMapInstance.current && isLoaded) {
      if (latitude && longitude) {
        setMarkerPosition(latitude, longitude, googleMapInstance.current, false);
      } else if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
    }
  }, [latitude, longitude, isLoaded, setMarkerPosition]);

  // Handle GPS location request
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoadingGps(false);
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));

        onChange({ latitude: lat, longitude: lng });

        if (googleMapInstance.current) {
          googleMapInstance.current.setZoom(17);
          setMarkerPosition(lat, lng, googleMapInstance.current, true);
        }
      },
      (err) => {
        setIsLoadingGps(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGpsError("Location permission denied. Please allow location access or drop a pin manually.");
            break;
          case err.POSITION_UNAVAILABLE:
            setGpsError("Location information is unavailable. Please click on the map to pin.");
            break;
          case err.TIMEOUT:
            setGpsError("Location request timed out. Please try again or pin on the map.");
            break;
          default:
            setGpsError("An unknown error occurred while retrieving location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleClearPin = () => {
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
      markerInstance.current = null;
    }
    onChange({ latitude: null, longitude: null });
    setGpsError(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLoadingGps}
            className="flex items-center gap-1.5 rounded-lg border border-[#0C83FF] bg-[#EBF5FF] px-3 py-1.5 text-xs font-semibold text-[#0C83FF] hover:bg-[#D6EBFF] transition-colors disabled:opacity-50 cursor-pointer font-onest"
          >
            <Navigation className={`h-3.5 w-3.5 ${isLoadingGps ? "animate-spin" : ""}`} />
            {isLoadingGps ? "Locating GPS..." : "Use Current Location"}
          </button>

          {latitude && longitude && (
            <button
              type="button"
              onClick={handleClearPin}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-onest"
              title="Clear pinned location"
            >
              <X className="h-3 w-3" />
              Clear Pin
            </button>
          )}
        </div>

        {latitude && longitude ? (
          <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200 font-mono">
            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
            <span>
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-500 italic font-onest">
            Click map or use GPS to drop pin
          </span>
        )}
      </div>

      {/* GPS Error Message */}
      {gpsError && (
        <div className="flex items-center gap-1.5 rounded-md bg-amber-50 p-2 text-xs text-amber-800 border border-amber-200">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Map Container */}
      <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-[#D6D9DE] bg-[#F3F4F6] shadow-inner">
        {mapLoadError ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-xs font-semibold text-gray-700 font-onest">{mapLoadError}</p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm font-onest">
              You can still use GPS or manual coordinates below to set the property location.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                step="0.000001"
                placeholder="Latitude"
                value={latitude ?? ""}
                onChange={(e) =>
                  onChange({
                    latitude: e.target.value ? parseFloat(e.target.value) : null,
                    longitude: longitude ?? null,
                  })
                }
                className="w-28 rounded border border-gray-300 p-1 text-xs"
              />
              <input
                type="number"
                step="0.000001"
                placeholder="Longitude"
                value={longitude ?? ""}
                onChange={(e) =>
                  onChange({
                    latitude: latitude ?? null,
                    longitude: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-28 rounded border border-gray-300 p-1 text-xs"
              />
            </div>
          </div>
        ) : (
          <>
            <div ref={mapRef} className="h-full w-full" />
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent" />
                  <span className="text-xs text-gray-600 font-onest">Loading Google Map...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="text-[11px] text-red-500 font-onest">{error}</p>}
    </div>
  );
}
