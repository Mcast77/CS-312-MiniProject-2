import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";
import { stat } from "fs";
import { error } from "console";

configDotenv();
const apiKey = process.env.API_KEY;

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

const states = [
  { name: "Alabama", code: "AL" },
  { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" },
  { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" },
  { name: "Delaware", code: "DE" },
  { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" },
  { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" },
  { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" },
  { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" },
  { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" },
  { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" },
  { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" },
  { name: "Wyoming", code: "WY" },
];

var weatherData = [];

app.get("/", (req, res) => {
  res.render(__dirname + "/index.ejs", { states: states, weatherData: weatherData });
});

app.post("/", async (req, res) => {
  weatherData = []
  var location = req.body.cityName;
  const state = req.body.state;
  if (req.body.inUSA === 'yes') {
    location = `${location},${state},US`;
  }
  weatherData.push( await getCurrentData( location ) );
  weatherData.push( await getForecastData( location ) );
  res.render(__dirname + "/index.ejs", { states: states, weatherData: weatherData, location:location });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

async function getCoords(location) {
  const geoURL = "http://api.openweathermap.org/geo/1.0/direct";
  const params = {
    q: location,
    limit: 1,
    appid: apiKey,
  };
  try {
    const result = await axios.get(geoURL, { params });
    if( result.data == [] ){
      throw error;
    }
    const { lat, lon } = result.data[0];
    return [lat, lon];
  } catch (error) {
    console.error("Fail to get data:", error.message);
    return null;
  }
}

async function getCurrentData(location) {
  const weatherDataUrl = "https://api.openweathermap.org/data/2.5/weather";
  try {
    const coords = await getCoords(location);
    const params = {
      lat: coords[0],
      lon: coords[1],
      units: "imperial",
      appid: apiKey,
    };
    const result = await axios.get(weatherDataUrl, { params });
    return result.data;
  } catch (error) {
    console.error("Fail to get data:", error.message);
    return 'incorrect';
  }
}

async function getForecastData(location) {
  const weatherDataUrl = "https://api.openweathermap.org/data/2.5/forecast";
  try {
    const coords = await getCoords(location);
    const params = {
      lat: coords[0],
      lon: coords[1],
      units: "imperial",
      appid: apiKey,
    };
    const result = await axios.get(weatherDataUrl, { params });
    return result.data;
  } catch (error) {
    console.error("Fail to get data:", error.message);
    return 'incorrect';
  }
}
