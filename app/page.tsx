
"use client"
import Image from 'next/image'
import  {useEffect} from 'react'

export default function Home() {
  useEffect(() => {
    // Load Mapbox and other scripts here
    const mapboxScript = document.createElement('script');
    mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js';
    mapboxScript.async = true;
    document.head.appendChild(mapboxScript);

    // Other script loading and setup here
    // ...

    return () => {
      // Clean up any resources when the component unmounts
      document.head.removeChild(mapboxScript);
      // Other clean-up logic
      // ...
    };
  }, []);

  return (
    <>
      <div>
      {/* Your HTML content goes here */}
      <pre id="ascii_title">
        {/* ASCII art title */}
      </pre>
      <p id="serverStatus">Server Status: Not Connected</p>
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
