'use client'
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net';
import { API_KEY } from '../config';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Home.css';

export default function Home() {
  const [currentView, setCurrentView] = useState('map');
  const [markerOn, setMarkerOn] = useState(false);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/nickyhama/cl2f6k55u000014qqkyfv26ml');
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState(3003);
  const [mapInst, setMapInst] = useState<mapboxgl.Map | null>(null);


  // Dummy data 
  const tableData = [
    { latitude: '40.7128', longitude: '-74.0060', imageLink: 'http://example.com/image1.jpg' },
    { latitude: '34.0522', longitude: '-118.2437', imageLink: 'http://example.com/image2.jpg' },
    { latitude: '37.7749', longitude: '-122.4194', imageLink: 'http://example.com/image3.jpg' },
    { latitude: '51.5074', longitude: '-0.1278', imageLink: 'http://example.com/image4.jpg' },
    { latitude: '48.8566', longitude: '2.3522', imageLink: 'http://example.com/image5.jpg' },
    { latitude: '35.6895', longitude: '139.6917', imageLink: 'http://example.com/image6.jpg' },
    { latitude: '55.7558', longitude: '37.6173', imageLink: 'http://example.com/image7.jpg' },
    { latitude: '39.9042', longitude: '116.4074', imageLink: 'http://example.com/image8.jpg' },
    { latitude: '-33.8688', longitude: '151.2093', imageLink: 'http://example.com/image9.jpg' },
    { latitude: '-23.5505', longitude: '-46.6333', imageLink: 'http://example.com/image10.jpg' },
    { latitude: '19.4326', longitude: '-99.1332', imageLink: 'http://example.com/image11.jpg' },
    { latitude: '28.6139', longitude: '77.2090', imageLink: 'http://example.com/image12.jpg' },
    { latitude: '-34.6037', longitude: '-58.3816', imageLink: 'http://example.com/image13.jpg' },
    { latitude: '41.9028', longitude: '12.4964', imageLink: 'http://example.com/image14.jpg' },
    { latitude: '30.0444', longitude: '31.2357', imageLink: 'http://example.com/image15.jpg' },
    { latitude: '-26.2041', longitude: '28.0473', imageLink: 'http://example.com/image16.jpg' },
    { latitude: '1.3521', longitude: '103.8198', imageLink: 'http://example.com/image17.jpg' },
    { latitude: '51.1657', longitude: '10.4515', imageLink: 'http://example.com/image18.jpg' },
    { latitude: '40.4637', longitude: '-3.7492', imageLink: 'http://example.com/image19.jpg' },
    { latitude: '36.2048', longitude: '138.2529', imageLink: 'http://example.com/image20.jpg' }
  ];

  const handleMapView = () => {
    setCurrentView('map');
  };

  const handleSettingsView = () => {
    setCurrentView('settings');
  };

  useEffect(() => {
    const mapboxScript = document.createElement('script');
    mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js';
    mapboxScript.async = true;
    document.head.appendChild(mapboxScript);

    const socketIoScript = document.createElement('script');
    socketIoScript.src = 'https://cdn.socket.io/socket.io-3.0.0.js';
    socketIoScript.async = true;
    document.head.appendChild(socketIoScript);

    mapboxgl.accessToken = API_KEY;
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      center: [0, 0],
      zoom: mapZoom
    });

    mapRef.current = mapInstance;
    setMapInst(mapInstance);

    const timeoutId = setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy();
      }
      $('#myTable').DataTable(); // Init
    }, 100);

    return () => {
      clearTimeout(timeoutId)
      if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().destroy();
      }
      document.head.removeChild(mapboxScript);
      document.head.removeChild(socketIoScript);
      if (marker) {
        marker.remove();
      }
    };
  }, []);


  //map settings handler
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyle);
      mapRef.current.setZoom(mapZoom);
    }
  }, [mapZoom, mapStyle]);


  //port event handler
  useEffect(() => {
   
    const socket = io(`ws://localhost:${port}`, { transports : ['websocket'] });
    
    socket.on('connect', function() {

      setIsConnected(true);
      //alert("Connected!")
      console.log("connected");
    });

    socket.on('disconnect', function() {
      setIsConnected(false);
      console.log("disconnected");
    });

    socket.on('coords', longlat => {
      //alert("RECEIVED")
      var long = longlat.substring(0, longlat.indexOf(","));
      var lat = longlat.substring(longlat.indexOf(",") + 1, longlat.length - 1);

      if (markerOn && marker) {
        marker.remove();
      }
      
      if (mapRef.current) {
        const newMarker = new mapboxgl.Marker({
          color: "#5E9DAD",
          draggable: false
        }).setLngLat([long, lat]).addTo(mapRef.current);
  
        setMarker(newMarker);
        setMarkerOn(true);
        
        mapRef.current.flyTo({
          center: [long, lat],
          zoom: 5,
          essential: true 
        });
      }
      else {
        alert("Fatal error: No instnace open")
      }
      
    });
    
  }, [port, mapInst]);


  return (
    <>
      <header className="header">
        <h1 className="logo">GeoHack</h1>
        <button 
          className={`nav-button nav-button1 ${currentView === 'map' ? 'active' : ''}`}
          onClick={handleMapView}
        >
          Map
        </button>
        <button 
          className={`nav-button nav-button2 ${currentView === 'settings' ? 'active' : ''}`}
          onClick={handleSettingsView}
        >
          Settings
        </button>
        <h2 className="status" style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? 'Online' : 'Offline'}
        </h2>
    </header>
  
      <div className="home">
        <div className="maps" style={{ display: currentView === 'map' ? 'block' : 'none' }}>
          <div id="map" style={{ width: '100%', height: '600px' }} />
        </div>
  
        <div className="settings" style={{ display: currentView === 'settings' ? 'block' : 'none' }}>
          <h1>Settings View</h1>
              <div>
                <label>
                  Map Zoom:
                  <input
                    type="number"
                    value={mapZoom}
                    onChange={(e) => setMapZoom(Number(e.target.value))}
                  />
                </label>
              </div>
              <div>
                <label>
                  Map Style:
                  <select value={mapStyle} onChange={(e) => setMapStyle(e.target.value)}>
                    <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
                    <option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</option>
                    <option value="mapbox://styles/mapbox/light-v10">Light</option>
                    <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
                    <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
                  </select>
                </label>
              </div>
              <div>
            <label>
              Socket Port:
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
  
        <div id="bottom" style={{ display: currentView === 'map' ? 'block' : 'none' }}>
         
          <table id="myTable" className="display">
            <thead>
              <tr>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Image Link</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.latitude}</td>
                  <td>{row.longitude}</td>
                  
                  <td><a href={row.imageLink} target="_blank" rel="noopener noreferrer">https://s3.amazonaws.com/geohack/screenshots/{`${row.latitude}_${row.longitude}`}.png
</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
                  