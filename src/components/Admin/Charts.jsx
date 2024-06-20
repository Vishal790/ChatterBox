import { CategoryScale, Chart, Legend, LinearScale, PointElement, Title, plugins, registerables, scales } from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { getLastSevenDays } from "../../utils/features";
import { orange } from "@mui/material/colors";
import { AspectRatio } from "@mui/icons-material";

Chart.register(...registerables);


const labels = getLastSevenDays();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      type: "category",

      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({value}) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Dataset",
        fill: true,
        backgroundColor: "rgba(75, 12, 192,0.3)",
        borderColor: "rgba(75, 12, 192,1)",
      },
    ],
  };

  return (
    <div>
      <Line data={data} options={lineChartOptions} />
    </div>
  );
};


const getCutoutValue = () =>
{
  if (window.innerWidth >= 1024) {
    return 110; 
  } else {
    return 140; 
  }

}

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: true,
  aspectRatio: 1,
  cutout: "80%",
};

const DoughnutChart = ({value =[],labels=[]}) => {

   const data = {
     labels,
     datasets: [
       {
         data: value,
         label: "Total Chats vs Group Chats",
         backgroundColor: ["rgba(75, 12, 192,0.3)", "#e91e63"],
         borderColor: ["rgba(75, 12, 192,1)", "#e91e63"],
         hoverBackgroundColor: ["#4a148c", "#ad1457"],
         offset: 40,
       },
     ],
   };

  return (

    <Doughnut data={data} options={doughnutChartOptions} />
  )
  
};

export { LineChart, DoughnutChart };
