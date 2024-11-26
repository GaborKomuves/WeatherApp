const apiKey = "13d8e0798bdf15d4cdee3767a5ee1f8b";

const weatherDataE1 = document.getElementById("weather-data");
const cityInputE1 = document.getElementById("city-input");
const formE1 = document.querySelector("form");
const regionE1 = document.querySelector(".region");

// Ascultă evenimentul de trimitere a formularului
formE1.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityValue = cityInputE1.value.trim();
  if (cityValue) {
    getWeatherDataByCity(cityValue);
  } else {
    alert("Please enter a city name.");
  }
});

// Funcția pentru obținerea datelor meteo în funcție de oraș
async function getWeatherDataByCity(cityValue) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) {
      throw new Error("City not found or network error");
    }

    const data = await response.json();
    
    // Actualizează DOM-ul cu datele meteo
    displayWeatherData(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Unable to retrieve weather data. Please try again later.");
  }
}

// Funcția pentru obținerea datelor meteo pe baza coordonatelor
async function getWeatherDataByCoords(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) {
      throw new Error("Network response was not okay");
    }

    const data = await response.json();
    
    // Obține numele locației folosind geocodare inversă
    const locationName = await getLocationName(lat, lon);
    
    // Actualizează DOM-ul cu datele meteo și locația
    displayWeatherData(data, locationName);
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    alert("Unable to retrieve weather data. Please try again later.");
  }
}

// Funcția pentru obținerea coordonatelor utilizatorului
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Obține datele meteo pe baza coordonatelor
      getWeatherDataByCoords(lat, lon);
    }, (error) => {
      console.error("Error getting location:", error);
      alert("Unable to retrieve location. Please enter a city name.");
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by your browser. Please enter a city name.");
  }
}

// Funcția pentru afișarea datelor meteo în DOM
function displayWeatherData(data, locationName) {
  const { main, weather, wind } = data;
  
  regionE1.textContent = locationName || data.name; // Folosește locația precisă sau fallback la numele locației din API-ul meteo
  weatherDataE1.querySelector(".temperature").textContent = `${main.temp}°C`;
  weatherDataE1.querySelector(".description").textContent = weather[0].description;
  weatherDataE1.querySelector(".details").innerHTML = `
    <div>Feels like: ${main.feels_like}°C</div>
    <div>Relative Humidity: ${main.humidity}%</div>
    <div>Wind speed: ${wind.speed} m/s</div>
  `;
}

// Funcția pentru geocodare inversă folosind Nominatim
async function getLocationName(lat, lon) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || data.display_name;
  } catch (error) {
    console.error("Error fetching location name:", error);
    return null; // Fallback la null dacă geocodarea inversă eșuează
  }
}

// Apelare funcție pentru a obține locația utilizatorului la încărcarea paginii
getUserLocation();
