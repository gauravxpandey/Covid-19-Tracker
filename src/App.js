import React, {useState, useEffect} from 'react';
import{MenuItem, formControl, Select, Card, CardContent} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';
import Table from './Table';
import { sortData, prettyPrintStat, prettyPrintStats } from './utilities';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all?yesterday=true")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
      console.log(data);
    })
  }, []); 

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        let sortedData = sortData(data);
        setCountries(countries);
        setMapCountries(data);
        setTableData(sortedData);
      });
    };

    getCountriesData();
  }, []);

  const onCountryCode = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
    
  }



  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <formControl className="app__dropdown">
          <Select
          variant="outlined"
          onChange={onCountryCode}
          value={country}
          >
            <MenuItem value="Worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </formControl>
      </div>


    <div className="app__status">
      <InfoBox 
      isRed
      active={casesType === "cases"}
      onClick={(e) => setCasesType("cases")}
      title="Cases" 
      cases={prettyPrintStat(countryInfo.todayCases)} 
      total={prettyPrintStats(countryInfo.cases)}
      customColor='#ff0000'
      customColor1='#D91717'
      hoverColor='#3E1B1B'
      />
      <InfoBox 
      isBlue
      active={casesType === "active"}
      onClick={(e) => setCasesType("active")}
      title="Active" 
      cases= {( " . " )} 
      total={prettyPrintStats(countryInfo.active)}
      customColor='#057EFF'
      customColor1='#4F4FF4'
      hoverColor='#1a1a41'
      />
      <InfoBox 
      active={casesType === "recovered"}
      onClick={(e) => setCasesType("recovered")}
      title="Recovered" 
      cases={prettyPrintStat(countryInfo.todayRecovered)} 
      total={prettyPrintStats(countryInfo.recovered)}
      customColor='#31AB4D'
      customColor1='#0E9A2E'
      hoverColor='#153f15'
      />
      <InfoBox 
      isGrey
      active={casesType === "deaths"}
      onClick={(e) => setCasesType("deaths")}
      title="Deaths" 
      cases={prettyPrintStat(countryInfo.todayDeaths)} 
      total={prettyPrintStats(countryInfo.deaths)}
      customColor='#8C9399'
      customColor1='#8F9397'
      hoverColor='#565454'
      /> 
    </div>



    {/* Map */}
    <Map
      casesType={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
    />

    </div>    
    
    <Card className="app__right">
      <CardContent>

        <h3 className="livecase">Live cases by country</h3>
        <Table countries={tableData} />
       
        <h3 className="livecase">Worldwide new {casesType}</h3>
        <LineGraph className="app__graph" casesType={casesType}/>

      </CardContent>
    </Card>
    
    <div className="foot">
      <h6>Made by Gaurav Pandey</h6>
    </div>
    

    </div>


  );
}

export default App;
