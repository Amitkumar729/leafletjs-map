import React, { useEffect } from "react";
import { Marker as LeafletMarker, useMap } from "react-leaflet";
import "leaflet-rotatedmarker";

const RotatedMarker = ({ position, icon, zIndexOffset, opacity, draggable, rotationAngle, rotationOrigin, children }) => {
  const map = useMap();

  useEffect(() => {
    const marker = new LeafletMarker(position, {
      icon,
      zIndexOffset,
      opacity,
      draggable
    }).addTo(map);

    if (rotationAngle !== undefined) {
      marker.setRotationAngle(rotationAngle);
    }

    if (rotationOrigin !== undefined) {
      marker.setRotationOrigin(rotationOrigin);
    }

    return () => {
      map.removeLayer(marker);
    };
  }, [position, icon, zIndexOffset, opacity, draggable, rotationAngle, rotationOrigin, map]);

  // Pass popup container to context for popups to work properly
  useEffect(() => {
    const popupContainer = map.getPane("popup");
    if (popupContainer) {
      map.setPopupContainer(popupContainer);
    }
  }, [map]);

  return null;
};

export default RotatedMarker;
