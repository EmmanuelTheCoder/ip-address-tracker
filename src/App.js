import {useEffect, useState} from 'react'
import './App.css'

export default function App(props) {
  
 // https://geo.ipify.org/api/v1?apiKey=at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d&ipAddress=8.8.8.8

  const apiDetails = {
    key: "at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d",
    ip: "8.8.8.8"
  }
  
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) =>{
    setInputValue(e.target.value);
    
  }
  // useEffect(()=>{
  //   callApi();
  // }, [handleSearch]);

  const callApi = async () =>{
    const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiDetails.key}&ipAddress=${apiDetails.ip}`);
    const data = await response.json();
    console.log(data)
    const {city, country, region, timezone} = data.location;
    console.log(city)
  }

  const handleOnChange = (e) =>{

    setInputValue(e.target.value);
   
  }

  return (
    <div>
      <div className="fix-background-img">
        
        <h1 className="address"><span>ip</span> address tracker</h1>
        <div className="buttons">

          <input type="text" placeholder="type in id address" value={inputValue} onChange={handleOnChange}/>
          <button type="button" onClick={callApi}>
              >
          </button>
        </div>

      </div>

      <div className="search-info">
        <div className="ip-address">

          <p>ip address</p>
          <p></p>
        </div>
        <div className="location">
          <p>location</p>
          <p></p>
        </div>
        <div className="timezone">
          <p>timezone</p>
          <p></p>
        </div>
        <div className="isp">
          <p>isp</p>
          <p></p>
        </div>
      </div>
    </div>
  )
}
