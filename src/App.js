import { useState, useEffect,  useRef } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl';
import Draggable from 'react-draggable';



//mapbox private api key
//sk.eyJ1IjoiZW1tYW51ZWx0aGVjb2RlciIsImEiOiJja2pldHZnaXYybnc3MzRtdHpicnF1ajNmIn0.goojDqwI5t-34ATSluhiPQ


export default function App() {
  
 // https://geo.ipify.org/api/v1?apiKey=at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d&ipAddress=8.8.8.8

  const apiDetails = {
    key: "at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d",
    ip: "105.112.73.23"
  }

  //mapbox
  mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tYW51ZWx0aGVjb2RlciIsImEiOiJja2plc2wwNHYxaGdlMnZzYzBydzgyeWYwIn0.NW8gMVi4TJ8kCqv6JlYUwA'
  const [adjustMap, setAdjustMap] = useState({
    long: '',
    lat: '',
  zoom: 2
  });
  let mapContainer = useRef(null);
  useEffect(()=>{
    const map = new mapboxgl.Map({
      container: mapContainer,
      style:  'mapbox://styles/mapbox/streets-v11',
      center: [adjustMap.long, adjustMap.lat],
      zoom: adjustMap.zoom
    })
    //map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setAdjustMap(()=> {
        return {...adjustMap, long: map.getCenter().lng.toFixed(4), lat: map.getCenter().lat.toFixed(4), zoom: map.getZoom().toFixed(2) } 
      });
      });
      new mapboxgl.Marker()
      .setLngLat([adjustMap.long, adjustMap.lat])
      .addTo(map);
      
      //map.scrollZoom.disable();
      return ()=> 
      map.remove();
     
      
  },[adjustMap])
  
  // useEffect(()=>{
  //   //adding control to the mapbox map. 
  //   const map = new mapboxgl()
  //   map.on('move', () => {
  //     setAdjustMap(()=> {
  //       return {...adjustMap, long: map.getCenter().lng.toFixed(4), lat: map.getCenter().lat.toFixed(4), zoom: map.getZoom().toFixed(2) }
  //     });
  //     });
  //     new mapboxgl.Marker()
  //     .setLngLat([adjustMap.long, adjustMap.lat])
  //     .addTo(map);
  //     //map.scrollZoom.disable();
  //     return ()=> 
  //     map.remove();
  // },[adjustMap])
  
  const [inputValue, setInputValue] = useState('');
  const [addressInfo, setAddressInfo] = useState({

    country: "",
    city: "",
    region: "",
    timezone: "",
    isp: "",
    ip: "",
    dataLoad: false,
    errorMessage: ""
  })
  const [loadingStatus, setLoadingStatus] = useState('')

  //styling the display
  
  
  const callApi = async () =>{
   setLoadingStatus("loading information...");
   
    const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiDetails.key}&ipAddress=${inputValue}`);
    const data = await response.json();

    console.log(data)
      if(data.as){

      
      const {city, country, region, timezone, lat, lng} = data.location;
        const {name} = data.as;
        const internetProvider = data.ip;
        
        const checkTruthy = data.as ? addressInfo.dataLoad = true : false;

            setAddressInfo(()=>{
              return {...addressInfo, city: city, country: country, region: region, timezone: timezone, isp: name, ip: internetProvider, dataLoad: checkTruthy, errorMessage: ""}
            })
          setLoadingStatus("")
          setInputValue("");
          setAdjustMap(()=>{
            return {...adjustMap, long: lng, lat: lat}
          })

      }else{
        setAddressInfo(()=>{
          return {errorMessage: "invalid IP address. Input correct IP address and try again "}
        })
        setLoadingStatus("");
      }
    
  }


 

  return (
    <div>
      <div className="fix-background-img">
        
        <h1 className="address"><span>ip</span> address tracker</h1>
        <div className="buttons">

          <input type="text" placeholder="type in IP address" value={inputValue} onChange={e=>setInputValue(e.target.value)}/>
          <button type="button" onClick={callApi}> 
              >
          </button>
        </div>

      </div>
      <Draggable>

      <div className="search-info" style={{display: addressInfo.dataLoad ? 'block' : 'none'}}>
        {(addressInfo.city) ? (
          <div className="display-info">
            <div className="ip-address">

              <p>ip address:</p>
              <p>
                {addressInfo.ip} 
              </p>

            </div>
            <div className="location">
            <p>location:</p>
            <p>
              {addressInfo.city} {addressInfo.region}, {addressInfo.country}
            </p>
            </div>
            <div className="timezone">
            <p>timezone:</p>
              <p>
              {addressInfo.timezone}
              </p>
            </div>
            <div className="isp">
            <p>isp:</p>
            <p>
              {addressInfo.isp}
            </p>
            </div> 
          </div>
        ) : ("")}
        
      </div>
        </Draggable>
        <p className="showcase">
          {loadingStatus}
        </p>
        <p className="errorMessage">{addressInfo.errorMessage}</p>
        <div className="sidebarStyle" style={{display: addressInfo.dataLoad ? "inline-block" : "none"}}>
          Longitude: {adjustMap.long} | Latitude: {adjustMap.lat} | Zoom: {adjustMap.zoom}
        </div>
        <div ref={el => mapContainer = el} className="mapContainer"> 
      
        </div>
    </div>
  )
}
