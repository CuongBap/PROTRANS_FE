import React, { useEffect,useState, useMemo } from 'react';
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react';
import "./App.css";



const locations = [
  { name: 'Location 1', latitude: 10.762622, longitude: 106.660172 },
  { name: 'Location 2', latitude: 10.823099, longitude: 106.629664 },
  // Add more locations here
];

const MapComponent = () => {

  const fetchMapStyle = async () => {
    const response = await fetch(`https://rsapi.goong.io/geocode?address=91%20Trung%20K%C3%ADnh,%20Trung%20H%C3%B2a,%20C%E1%BA%A7u%20Gi%E1%BA%A5y,%20H%C3%A0%20N%E1%BB%99i&api_key=20C8fOYZrkTRtDBnIPeTFT5nRQXhQr7rKNlm4p9b`); // URL : 'https://rsapi.goong.io/geocode?address= + địa chỉ + '&api_key=20C8fOYZrkTRtDBnIPeTFT5nRQXhQr7rKNlm4p9b'
    const data = await response.json();
    console.log(data.results[0].geometry.location.lat + " --- " + data.results[0].geometry.location.lng ) // Lấy vĩ độ --- kinh độ
    console.log(data.results[0].address) // Lấy tên địa chỉ
  };
  fetchMapStyle();

  const [viewport, setViewport] = useState({
    width: '700px',
    latitude: 10.762622, longitude: 106.660172,
    height: '700px',
    zoom: 10,
    
  });   
  const markers = useMemo(
    () =>
      locations.map((location) => (
        <Marker
          key={location.name}
          latitude={location.latitude}
          longitude={location.longitude}
        >
          <img src="pin.png" alt={location.name} />
        </Marker>
      )),
    []
  );

  return (
    <ReactMapGL
      className='M'
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      goongApiAccessToken='tAbnsQswJMQd1me8L7LpUOiOT6Y4z8cnBAmk7Ugo'
    >
      {markers}
    </ReactMapGL>
  );
};

export default MapComponent;
//<link href='https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.css' rel='stylesheet' />