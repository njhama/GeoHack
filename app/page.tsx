
"use client"
import Image from 'next/image'
import  {useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl'
import io from 'socket.io-client';
import {API_KEY1} from '../config.js'
import 'mapbox-gl/dist/mapbox-gl.css'; 

export default function Home() {
  const [markerOn, setMarkerOn] = useState(false);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

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

    console.log("JHERERE111")

    //Create new map
    const map = new mapboxgl.Map({
      container: 'map',
      style: map_mapbox_style,
      center: [0, 0],
      zoom: map_zoom
    });

    //scokets
    const socket = io("ws://localhost:3003", { transports : ['websocket'] })
    socket.on('connect', function() {
      console.log("connected")
      
    });
    
    //disconnect
    socket.on('disconnect', function() {
      console.log("disconnected")
    });

   

    socket.on('coords', longlat => 
    {
    
      console.log('reset marker')
      //let marker : mapboxgl.Marker;

      var long = longlat.substring(0, longlat.indexOf(","));
      var lat =  longlat.substring(longlat.indexOf(",") +1, longlat.length - 1);

      if (markerOn && marker)   
      {
        marker.remove();
        console.log("remove ")
      }

      const newMarker = new mapboxgl.Marker({
          color: "#5E9DAD",
          draggable: false
      }).setLngLat([long, lat])
      .addTo(map)

      setMarker(newMarker);
      setMarkerOn(true);
      //when it recieves the coords add it to the map
      console.log(longlat)
      
      flyToLoc(long,lat)
    })

    //change map pov
    function flyToLoc(long: number, lat: number)
{
  
    map.flyTo({
        center: [long, lat],
        zoom: 5,
        essential: true 
    });

    return () => {
      if (marker) {
        marker.remove()
      }
    }

}


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
      <h1>GeoHack</h1>
      <div className="maps">
        <div id="map" style={{ width: '80%', height: '600px', display: 'inline-block'}} />
      </div>
      <div id="bottom">
        <p id="server_text">Enter a Game to Begin</p>
      </div>
    </div>
      
    </>
  )
}
