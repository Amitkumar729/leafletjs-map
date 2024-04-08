import { useState, useEffect, useRef } from "react";
import "./App.css";
import carImage from "./assets/car.png";
import { coordinatess } from "./data";
import RotatedMarker from "./rotatedMarker";

function App() {
  const myMap = useRef(null);
  const carMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (!myMap.current._leaflet_id) {
      var map = L.map("map").setView([28.56467260042718, 77.3354040437753], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // car icon using L.icon...
      const carIcon = L.icon({
        iconUrl: carImage,
        iconSize: [30, 45], //size of the car icon
        iconAnchor: [10, 20], // anchor point of the car icon
      });

      const carMarker = L.marker([28.56467260042718, 77.3354040437753], {
        icon: carIcon,
        draggable: true,
        // setRotationAngle: 45,
      }).addTo(map);

      // const iconElement = document.querySelector(".leaflet-marker-icon");
      // iconElement.style.transform = `rotate(-90deg)`;

      carMarkerRef.current = carMarker;

      const polyline = L.polyline(coordinatess).addTo(map);
      polylineRef.current = polyline;

      map.fitBounds(polyline.getBounds());
    }
  }, []);

  const moveCar = async () => {
    setIsMoving(true);
    const carMarker = carMarkerRef.current;
    const polyline = polylineRef.current;

    const latlngs = polyline.getLatLngs();
    // console.log("latlngs -> ", latlngs);
    const duration = 10000; // Duration of animation in milliseconds
    const steps = 100; // Number of steps for animation

    // Calculate step duration
    const stepDuration = duration / steps;

    let angle = 0;

    // Iterating through each step for smoother animation
    for (let i = 0; i <= steps; i++) {
      //finding the start and end idx along the polyline...
      const index = (i / steps) * (latlngs.length - 1);
      const startIndex = Math.floor(index);
      const endIndex = Math.ceil(index);
      const startLatLng = latlngs[startIndex];
      const endLatLng = latlngs[endIndex];
      const ratio = index - startIndex;

      // Calculating the angle between the current and next polyline coordinates
      const deltaX = endLatLng.lat - startLatLng.lat;
      const deltaY = endLatLng.lng - startLatLng.lng;
      angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      angle = (angle + 360) % 360;

      // Moving the marker to a new position along the line using interpolation...
      const interpolatedLatLng = L.latLng(
        startLatLng.lat + (endLatLng.lat - startLatLng.lat) * ratio,
        startLatLng.lng + (endLatLng.lng - startLatLng.lng) * ratio
      );

      // console.log(
      //   `Angle between coordinates ${startIndex} and ${endIndex}: ${angle}`
      // );

      carMarker.setLatLng(interpolatedLatLng);
      // carMarker.setRotationAngle(`${angle}`);

      //for rotation...
      const iconElement = document.querySelector(".leaflet-marker-icon");

      // iconElement.style.border = "1px solid red";
      carMarker.setRotationAngle(angle);
      // iconElement.style.transform = `rotate(${angle}deg)`;

      // Delay for the next step...
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
    setIsMoving(false);
  };

  return (
    <div>
      <div id="map" ref={myMap} style={{ height: "600px" }}></div>
      <div className="move-button">
        <button onClick={moveCar} disabled={isMoving}>
          {isMoving ? "Moving..." : "Move"}
        </button>
      </div>
    </div>
  );
}

export default App;
