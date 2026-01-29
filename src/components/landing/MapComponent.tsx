"use client";

import React from "react";
import { Map, Marker } from "pigeon-maps";

const DILWARA_LOC: [number, number] = [24.609428, 72.722633];

export default function MapComponent() {
  return (
    <div className="w-full h-full">
      <Map 
        defaultCenter={DILWARA_LOC} 
        defaultZoom={15}
        mouseEvents={true}
        touchEvents={true}
      >
        <Marker width={50} anchor={DILWARA_LOC} color="#EA4335" />
      </Map>
    </div>
  );
}