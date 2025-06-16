document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "94601585a670347e7fa135d1962e265e"; // <<<<< CECI EST MA CLÉ API DE OpenWeatherMap
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const cityNameElement = document.getElementById("city-name");
  const temperatureElement = document.getElementById("temperature");
  const descriptionElement = document.getElementById("description");
  const weatherIconElement = document.getElementById("weather-icon");
  const feelsLikeElement = document.getElementById("feels-like");
  const humidityElement = document.getElementById("humidity");
  const windSpeedElement = document.getElementById("wind-speed");
  const pressureElement = document.getElementById("pressure");

  async function getWeatherData() {
    try {
      // 1. Lire la ville depuis conf.json
      const configResponse = await fetch("conf.json");
      if (!configResponse.ok) {
        throw new Error(
          `Erreur lors du chargement de conf.json: ${configResponse.statusText}`
        );
      }
      const config = await configResponse.json();
      const city = config.city;

      if (!city) {
        throw new Error("Le nom de la ville n'est pas défini dans conf.json.");
      }

      cityNameElement.textContent = city;

      // 2. Récupérer les données météo depuis OpenWeatherMap
      const weatherResponse = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Erreur API météo: ${weatherResponse.statusText}`);
      }

      const weatherData = await weatherResponse.json();
      console.log("Données météo reçues :", weatherData); // Pour le débogage

      // 3. Afficher les données
      const temperature = Math.round(weatherData.main.temp); // Rondir la température
      const description = weatherData.weather[0].description;
      const iconCode = weatherData.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
      const feelsLike = Math.round(weatherData.main.feels_like); // Rondir la température ressentie
      const humidity = weatherData.main.humidity;
      const windSpeed = (weatherData.wind.speed * 3.6).toFixed(1); // Convertir m/s en km/h et garder 1 décimale
      const pressure = weatherData.main.pressure;

      temperatureElement.textContent = `${temperature}°C`;
      descriptionElement.textContent = description;
      weatherIconElement.src = iconUrl;
      weatherIconElement.style.display = "block";

      feelsLikeElement.textContent = `${feelsLike}°C`;
      humidityElement.textContent = `${humidity}%`;
      windSpeedElement.textContent = `${windSpeed} km/h`; // Affichage de la vitesse du vent en km/h
      pressureElement.textContent = `${pressure} hPa`;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération ou l'affichage de la météo :",
        error
      );
      cityNameElement.textContent = "Erreur de chargement";
      temperatureElement.textContent = "--°C";
      descriptionElement.textContent = "N/A";
      weatherIconElement.style.display = "none";
      feelsLikeElement.textContent = "--°C";
      humidityElement.textContent = "--%";
      windSpeedElement.textContent = "-- km/h";
      pressureElement.textContent = "-- hPa";
    }
  }

  getWeatherData();
  setInterval(getWeatherData, 3600000); // Rafraîchir toutes les heures
});
