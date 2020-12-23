import { useState } from 'react'
import './App.css'

export default function App() {
  
 // https://geo.ipify.org/api/v1?apiKey=at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d&ipAddress=8.8.8.8

  const apiDetails = {
    key: "at_gUqa5hjKchLKYYiPFCfCqOtRSLP2d",
    ip: "105.112.73.23"
  }
  
  const [inputValue, setInputValue] = useState('');
  const [addressInfo, setAddressInfo] = useState({

    country: "",
    city: " ",
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
    //setAddressInfo({...addressInfo, isLoading: true});
    //addressInfo.isloading ? setLoadingStatus("Loading information") : setLoadingStatus("");

    const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiDetails.key}&ipAddress=${inputValue}`);
    const data = await response.json();
    console.log(data)
    if(data.as){
      const {city, country, region, timezone} = data.location;
      const {name} = data.as;
      const {ip} = data.ip;
      
      const checkTruthy = data.as ? addressInfo.dataLoad = true : false;

          setAddressInfo(()=>{
            return {...addressInfo, city: city, country: country, region: region, timezone: timezone, isp: name, ip: ip, dataLoad: checkTruthy, isLoading: false}
          })

    }else{
      const {message} = data
      setAddressInfo(()=>{
        return {errorMessage: message}
      })
    }

    // const validity = <p>You have inputed an incorrect IP address. Try again with a correct one!</p>

    // if(!data.as){
    //   setAddressInfo({
    //     ...addressInfo, errorMessage: "you have inputed a wrong ip address, check and try again"
    //   })
    // }
    //console.log(city);

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
          <>
            <div className="ip-address">

            <p>ip address:</p>
              <p>
                {inputValue} 
              </p>
            </div>
            <div className="location">
            <p>location:</p>
            <p>
              {addressInfo.city + addressInfo.region + "" + "," + addressInfo.country}

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
          </>
        ) : (<p>{addressInfo.errorMessage}</p>)}
        
      </div>
        {/* <p>
          {loadingStatus}
        </p> */}
        {/* <p>{addressInfo.errorMessage}</p> */}
    </div>
  )
}
