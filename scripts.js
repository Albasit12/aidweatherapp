const apiUrl = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto&";

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');

async function checkWeather(city) {
  // Step 1: Find city -> get lat & lon (Open-Meteo need this)
  const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
  var geoData = await geoResponse.json();
  
  if (!geoData.results) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    return;
  }
  
  const lat = geoData.results[0].latitude;
  const lon = geoData.results[0].longitude;
  const cityName = geoData.results[0].name;
  
  // Step 2: Get weather with lat & lon
  const response = await fetch(apiUrl + `latitude=${lat}&longitude=${lon}`);
  var data = await response.json();
  
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    document.querySelector(".city").innerHTML = cityName;
    document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°C";
    document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
    document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";
    
    // Convert Open-Meteo weather_code to your same names: Clear, Clouds, Rain, Drizzle, Mist, Snow
    const code = data.current.weather_code;
    let main = "Clear";
    if (code === 0 || code === 1) {
      main = "Clear";
    } else if (code === 2 || code === 3) {
      main = "Clouds";
    } else if (code === 45 || code === 48) {
      main = "Mist";
    } else if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
      main = "Drizzle";
    } else if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
      main = "Rain";
    } else if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
      main = "Snow";
    }
    
    if (main == "Clouds") {
      weatherIcon.src = "cloud.png";
    } else if (main == "Clear") {
      weatherIcon.src = "clear.png";
    } else if (main == "Rain") {
      weatherIcon.src = "rain.png";
    } else if (main == "Drizzle") {
      weatherIcon.src = "drizzle.png";
    } else if (main == "Mist") {
      weatherIcon.src = "mist.png";
    } else if (main == "Snow") {
      weatherIcon.src = "snow.png";
    }
    
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});