'use client'
import React, { useEffect, useState } from 'react';
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

  const [markerOn, setMarkerOn] = useState(false);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

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
      style: 'mapbox://styles/nickyhama/cl2f6k55u000014qqkyfv26ml',
      center: [0, 0],
      zoom: 3
    });

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

    $(document).ready(function() {
      $('#myTable').DataTable();
    });

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

  return (
    <>
      <header className="header">
        <h1 className="logo">GeoHack</h1>
        <button className="nav-button1">Map</button>
        <button className="nav-button2">Settings</button>
        <p className="status">Status</p>
      </header>
      <div className="home">
        <div className="maps">
          <div id="map" style={{ width: '100%', height: '600px' }} />
        </div>
        <div id="bottom">
          <p id="server_text">Enter a Game to Begin</p>
          <table id="myTable" className="display">
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
            {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.column1}</td>
                  <td>{row.column2}</td>
                  {/* ... more columns as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
