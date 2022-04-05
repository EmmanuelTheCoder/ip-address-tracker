import { useState, useEffect,  useRef } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl';
import Draggable from 'react-draggable';






export default function App() {


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
  
 
  const [inputValue, setInputValue] = useState('');
  const [addressInfo, setAddressInfo] = useState({
    city: "",
    country: "",
    ipAddress: "",
    isp: "",
    region: "",
    timezone: "",
    dataLoad: false,
    errorMessage: "",
    location: ""
  })
  const [loadingStatus, setLoadingStatus] = useState('')

  //styling the display
  
  
  const callApi = async () =>{
   setLoadingStatus("loading information...");
   
    const response = await fetch('https://ipinfo.io/json?token=65792d8fa53479');
    const data = await response.json();

    console.log(data)
      if(data){

      
      const {city, country, ip, org, loc, region, timezone} = data;

      
        const checkTruthy = data.as ? addressInfo.dataLoad = true : false;
        
            setAddressInfo(()=>{
              return {city: city, country: country, region: region, 
                timezone: timezone, isp: org, ipAddress: ip,
                dataLoad: checkTruthy, errorMessage: ""
              }
            })
          setLoadingStatus("")
          setInputValue("");
          setAdjustMap(()=>{
            return {...adjustMap, long: 1.2323, lat: 4.2344}
          })

      }else{
        setAddressInfo(()=>{
          return {errorMessage: "invalid IP address. Input correct IP address and try again "}
        })
        setLoadingStatus("");
      }
    
  }


 useEffect(() =>{
   callApi()
 }, [])

  return (
    <div>
      <div className="fix-background-img">
        
        <h1 className="address"><span>ip</span> address tracker</h1>
        <div className="buttons">

          <input type="text" placeholder="type in IP address" value={addressInfo.ipAddress} />
          {/* onChange={e=>setInputValue(e.target.value)} */}
          <button type="button" onClick={callApi}> 
              >
          </button>
        </div>

      </div>
      <Draggable>

      <div className="search-info" >
        {(addressInfo.city) ? (
          <div className="display-info">
            <div className="ip-address">

              <p>ip address:</p>
              <p>
                {addressInfo.ipAddress} 
              </p>

            </div>
            <div className="location">
            <p>location:</p>
            <p>
              {addressInfo.region} {addressInfo.city}, {addressInfo.country}
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
              <p> {addressInfo.isp}</p>
            </div> 
            <div className="vpn">
             
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
