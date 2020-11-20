import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType= "cases") => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType , ...props}) {
  const [data, setData] = useState({});

  const [bgcolor, setBgColor] = useState('#7dd71d');
  const [bcolor, setBColor] = useState('#CAE6FF');

  console.log(casesType);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          console.log(chartData);
          // buildChart(chartData);
        });
    };

    switch(casesType) {
      case 'cases':
        setBgColor('#cc1034')
        setBColor('#BE2C2C')
        break
      case 'active':
        setBgColor('#0080FF')
        setBColor('#075CB2')
        break
      case 'recovered':
        setBgColor('#7dd71d')
        setBColor('green')
        break
      case 'deaths':
        setBgColor('#8C9399')
        setBColor('black')
        break
      default:
        setBgColor('#fb4443')
        setBColor('gray')
        break
    }

    fetchData();
  }, [casesType]);



  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: bgcolor ,
                borderColor: bcolor ,
                data: data,
              }
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;