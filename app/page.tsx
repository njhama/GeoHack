
"use client"
import Image from 'next/image'
import  {useEffect} from 'react';
import mapboxgl from 'mapbox-gl'
import io from 'socket.io-client';
import {API_KEY1} from '../config.js'

export default function Home() {
  useEffect(() => {
    // Load Mapbox and other scripts here
    const mapboxScript = document.createElement('script');
    mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js';
    mapboxScript.async = true;
    document.head.appendChild(mapboxScript);

    // Load Socket.IO script
    const socketIoScript = document.createElement('script');
    socketIoScript.src = 'https://cdn.socket.io/socket.io-3.0.0.js';
    socketIoScript.async = true;
    document.head.appendChild(socketIoScript);

    //API

    const map_mapbox_style = 'mapbox://styles/nickyhama/cl2f6k55u000014qqkyfv26ml';
    const map_zoom = 3;
    mapboxgl.accessToken = API_KEY1;

    console.log("JHERERE11")
    const map = new mapboxgl.Map({
      container: 'map',
      style: map_mapbox_style,
      center: [0, 0],
      zoom: map_zoom
    });

    //this will run afterwards
    return () => {
      document.head.removeChild(mapboxScript);
      document.head.removeChild(socketIoScript);
    };
  }, []);

  return (
    <>
      <div>
      {/* Your HTML content goes here */}
      <pre id="ascii_title">
        {/* ASCII art title */}
      </pre>
      <p id="serverStatus">Server Stadtus: No1t Connecte123123d1</p>
      <div className="maps">
        <div id="map" style={{ width: '60%', height: '600px', display: 'inline-block' }} />
      </div>
      <div id="bottom">
        <p id="server_text">Enter a Game to Begin</p>
      </div>
    </div>
      
    </>
  )
}
