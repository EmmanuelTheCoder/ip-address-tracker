import { useState, useEffect } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl';
//mapbox api key
//sk.eyJ1IjoiZW1tYW51ZWx0aGVjb2RlciIsImEiOiJja2pldHZnaXYybnc3MzRtdHpicnF1ajNmIn0.goojDqwI5t-34ATSluhiPQ


export default function App() {
  
 // https://geo.ipify.org/api/v1?apiKey=at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d&ipAddress=8.8.8.8

  const apiDetails = {
    key: "at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d",
    ip: "105.112.73.23"
  }

  //mapbox
  mapboxgl.accessToken = 'sk.eyJ1IjoiZW1tYW51ZWx0aGVjb2RlciIsImEiOiJja2pldHZnaXYybnc3MzRtdHpicnF1ajNmIn0.goojDqwI5t-34ATSluhiPQ'
  const [adjustMap, setAdjustMap] = useState({
    long: 5,
    lat: 34,
    zoom: 2
  });
  useEffect(()=>{
    const map = new mapboxgl.Map({
      container: mapContainer,
      style:  'mapbox://styles/mapbox/streets-v11',
      center: [adjustMap.long, adjustMap.lat],
      zoom: adjustMap.zoom
    })
    map.on('move', () => {
      setAdjustMap(()=> {
        return {...adjustMap, long: map.getCenter().lng.toFixed(4), lat: map.getCenter().lat.toFixed(4), zoom: map.getZoom().toFixed(2) }
      });
      });
  },[adjustMap])
  

  
  const [inputValue, setInputValue] = useState('');
  const [addressInfo, setAddressInfo] = useState({

    country: "",
    city: "",
    region: "",
    timezone: "",
    isp: "",
    ip: "",
    dataLoad: false,
    isLoading: false,
    errorMessage: ""
  })
  const [loadingStatus, setLoadingStatus] = useState('')

 
  // useEffect(()=>{
  //   callApi();
  // }, [handleSearch]);

  const callApi = async () =>{
   setLoadingStatus("loading information...");
   
    const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiDetails.key}&ipAddress=${inputValue}`);
    const data = await response.json();

    console.log(data)

    


      if(data.as){

      
      const {city, country, region, timezone} = data.location;
        const {name} = data.as;
        const internetProvider = data.ip;
        
        const checkTruthy = data.as ? addressInfo.dataLoad = true : false;

            setAddressInfo(()=>{
              return {...addressInfo, city: city, country: country, region: region, timezone: timezone, isp: name, ip: internetProvider, dataLoad: checkTruthy, isLoading: false, errorMessage: ""}
            })
          setLoadingStatus("")
          setInputValue("");

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

          <input type="text" placeholder="type in ip address" value={inputValue} onChange={e=>setInputValue(e.target.value)}/>
          <button type="button" onClick={callApi}> 
              > 
          </button>
        </div>

      </div>

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
        <p className="showcase">
          {loadingStatus}
        </p>
        <p className="errorMessage">{addressInfo.errorMessage}</p>
        <div ref={el => mapContainer= el} className="mapContainer"> 
      
        </div>
    </div>
  )
}
