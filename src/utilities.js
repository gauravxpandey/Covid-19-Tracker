import React from "react";
import numeral from "numeral";
import "./Map.css";
import { Circle, Popup } from "react-leaflet";


const casesTypeColors = {
    cases: {
        hex: "#cc1034",
        multiplier: 800,
    },
    active: {
        hex: "#057EFF",
        multiplier: 1000,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#8C9399",
        multiplier: 2000,
    },
};



export  const sortData = (data) => {
    const sortedData = [...data];

    //return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    });
    return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0,0")}` : "+0";

export const prettyPrintStats = (stat) =>
  stat ? `${numeral(stat).format("0,0")}` : "0";

// Draw circle with tooltip 
export const showDataOnMap = (data, casesType ) => (
    data.map(country => (
        <Circle
            center= {[country.countryInfo.lat, country.countryInfo.long]}
            color= {casesTypeColors[casesType].hex}
            fillColor= {casesTypeColors[casesType].hex}
            filOpacity= {0.4}
            radius= {
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
             <Popup>
                <div className="info-container">
                <div
                    className="info-flag"
                    style={{ backgroundImage: `url(${country.countryInfo.flag})`}}
                />
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-active">Active: {numeral(country.active).format("0,0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div> 
                <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);

