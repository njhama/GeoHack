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
  const tableData = [
    { column1: 'Row 1 Data 1', column2: 'Row 1 Data 2' },
    { column1: 'Row 2 Data 1', column2: 'Row 2 Data 2' },
    { column1: 'Row 3 Data 1', column2: 'Row 3 Data 2' },
    
  ];
  const [currentView, setCurrentView] = useState('map');
  const [markerOn, setMarkerOn] = useState(false);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/nickyhama/cl2f6k55u000014qqkyfv26ml');
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const handleMapView = () => {
    setCurrentView('map');
  };

  const handleSettingsView = () => {
    setCurrentView('settings');
  };

  
  //no dependencies
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
    const map = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      center: [0, 0],
      zoom: mapZoom
    });

    mapRef.current = map;

    const socket = io("ws://localhost:3003", { transports : ['websocket'] });
    socket.on('connect', function() {
      console.log("connected");
    });

    socket.on('disconnect', function() {
      console.log("disconnected");
    });

    socket.on('coords', longlat => {
      var long = longlat.substring(0, longlat.indexOf(","));
      var lat = longlat.substring(longlat.indexOf(",") + 1, longlat.length - 1);

      if (markerOn && marker) {
        marker.remove();
      }

      const newMarker = new mapboxgl.Marker({
        color: "#5E9DAD",
        draggable: false
      }).setLngLat([long, lat])
      .addTo(map);

      setMarker(newMarker);
      setMarkerOn(true);
      
      map.flyTo({
        center: [long, lat],
        zoom: 5,
        essential: true 
      });
    });

    if (currentView === 'map') {
      //alert("MAP")
      if ($.fn.DataTable.isDataTable('#myTable')) {
          //alert("DESTROYED")
          $('#myTable').DataTable().destroy();
      }
      $('#myTable').DataTable();
  }

    return () => {
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

  //when mapzoom and mapstyle changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyle);
      mapRef.current.setZoom(mapZoom);
    }
  }, [mapZoom, mapStyle]);

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
        <p className="status">Status</p>
      </header>
  
      <div className="home">
        <div className="maps" style={{ display: currentView === 'map' ? 'block' : 'none' }}>
          <div id="map" style={{ width: '100%', height: '600px' }} />
        </div>
  
        <div className="settings" style={{ display: currentView === 'settings' ? 'block' : 'none' }}>
          <p>Settings View</p>
           
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
        </div>
  
        <div id="bottom" style={{ display: currentView === 'map' ? 'block' : 'none' }}>
          <p id="server_text">Enter a Game to Begin</p>
          <table id="myTable" className="display">
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
           
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.column1}</td>
                  <td>{row.column2}</td>
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
