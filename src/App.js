
import  React,{useEffect,useState,useRef} from "react";

import { Wrapper } from "@googlemaps/react-wrapper";
import useDeepCompareEffect from 'use-deep-compare-effect';

const render = (status) => {
  return <h1>{status}</h1>;
}

export default function APP () {

 
  const [zoom, setZoom] = useState(12); // initial zoom
  const [center, setCenter] = useState({
    lat:  0.04777,
    lng: -78.22168,
  });


  const [valor, setValor] = useState({
    lat:  0.04777,
    lng: -78.22168,
  })
  const [clicks, setClicks] = useState([]);

  const onClick = (e) => {
    // avoid directly mutating state
    setClicks([e.latLng]);
    setValor(e.latLng.toJSON())
    console.log("valor",valor.lat.toFixed(8))
  
  };

  const onIdle = (m) => {

  setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  
    
  };

  const form = (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      
      <input
        type="number"
        id="lat"
        name="lat"
        value={valor.lat}
        onChange={(event) =>
          setValor({ lat: Number(event.target.value) })
        }
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={valor.lng}
        onChange={(event) =>
          setValor({ lng: Number(event.target.value) })
        }
      />
 
      <h3>{clicks.length === 0 ? "Click on map to add markers" : "Clicks"}</h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null,2)}</pre>
      ))}
    
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Wrapper apiKey={"AIzaSyAW8ksVEmpDeIRjy65HMVNyKORzMDQR37I"} render={ render} >
        <Map
          center={center}
          onIdle={onIdle}
          onClick={onClick}
          style={{ width: '700px', height: '100%' }}
          zoom={zoom}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
        </Map>
      </Wrapper>
    
      {form}
    </div>
  );
};

const Map= ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  
  useDeepCompareEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};


const Marker = (options) => {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
}

