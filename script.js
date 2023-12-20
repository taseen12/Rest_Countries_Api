
function scrollToEnd() {
    
  window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
  });
}
document.addEventListener("DOMContentLoaded", function () {
  
  fetchAllCountriesNames();
});

function fetchAllCountriesNames() {
  var apiUrl = "https://restcountries.com/v3.1/all";
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      populateCountryDropdown(data);
    })
    .catch(error => console.error('Error fetching country data:', error));
}

function populateCountryDropdown(countries) {
  var countrySelect = document.getElementById("countrySelect");

  countries.forEach(country => {
    var option = document.createElement("option");
    option.value = country.name.common;
    option.textContent = country.name.common;
    countrySelect.appendChild(option);
  });
}
function displayCountryDetails() {
  var selectedCountry = document.getElementById("countrySelect").value;
  var countryDetailsContainer = document.getElementById("countryDetailsContainer");

  
  countryDetailsContainer.innerHTML = "";

  if (!selectedCountry) {
    
    return;
  }

  var countryApiUrl = `https://restcountries.com/v3.1/name/${selectedCountry}`;
  fetch(countryApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      var country = data[0];
      var countryDetails = document.createElement("div");

      
      if (country.flags && country.flags.png) {
        var flagImg = document.createElement("img");
        flagImg.src = country.flags.png;
        flagImg.alt = `Flag of ${country.name.common}`;
        flagImg.classList.add("country-flag");
        countryDetails.appendChild(flagImg);
      }

      
      countryDetails.innerHTML += `
        <h2>${country.name.common}</h2>
        <p>Capital: ${country.capital || 'N/A'}</p>
        <p>Population: ${country.population || 'N/A'}</p>
        <p>Region: ${country.region || 'N/A'}</p>
        
      
      `;

      var moreDetailsButton = document.createElement("button");
      moreDetailsButton.textContent = "More Details";
      moreDetailsButton.classList.add("more-details-button");
      moreDetailsButton.onclick = function() {
        fetchWeatherData(selectedCountry, country.capital);
      };
      countryDetails.appendChild(moreDetailsButton);

      countryDetailsContainer.appendChild(countryDetails);
    })
    .catch(error => console.error('Error fetching country data:', error));
}

function fetchWeatherData(countryName, city) {

  var openWeatherApiKey = "6c64698dc5c9adcc83b19e5baf735ed3";
  var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`;

  fetch(weatherApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(weatherData => {
      
      console.log("Weather Data:", weatherData); 
      var temperatureCelsius = weatherData.main.temp - 273.15;
      
      
      var weatherDetailsContainer = document.getElementById("weatherDetails");

   
      var imageUrl = temperatureCelsius > 25
        ? "images/sunny.png"  
        : "images/cold.jfif";  

      weatherDetailsContainer.innerHTML = `<div class= "weather1">
        <h3>Weather in ${countryName}:</h3>
        <p>Temperature: ${temperatureCelsius.toFixed(2)} °C</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Description: ${weatherData.weather[0].description}</p>
        <img src="${imageUrl}" alt="Weather Image"></div>
        <!-- Add more weather details as needed -->
      `;
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

// 
// 
// 
// 

document.addEventListener("DOMContentLoaded", function () {

  populateRegionDropdown();
  populateCountryDropdown();

 
  document.getElementById("filterByRegionButton").addEventListener("click", filterByRegion);
  document.getElementById("filterByCountryButton").addEventListener("click", filterByCountry);
  filterByRegion();
});

function populateRegionDropdown() {
  var regionSelect = document.getElementById("regionSelect");
  var apiUrl = "https://restcountries.com/v3.1/all";

  
  var defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Regions";
  regionSelect.appendChild(defaultOption);

 
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      var regions = new Set();

      
      data.forEach(country => {
        if (country.region) {
          regions.add(country.region);
        }
      });

      
      regions.forEach(region => {
        var option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching country data:', error));
}

function populateCountryDropdown() {
  var countrySelect = document.getElementById("countrySelect");
  var apiUrl = "https://restcountries.com/v3.1/all";

 
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      
      var defaultOption = document.createElement("option");
      defaultOption.value = "all";
      defaultOption.textContent = "All Countries";
      countrySelect.appendChild(defaultOption);

      
      data.forEach(country => {
        var option = document.createElement("option");
        option.value = country.name.common;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching country data:', error));
}

function filterByRegion() {
  var selectedRegion = document.getElementById("regionSelect").value;
  var apiUrl = selectedRegion === "all"
    ? "https://restcountries.com/v3.1/all"
    : `https://restcountries.com/v3.1/region/${selectedRegion}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => displayCountryDetails2(data))
    .catch(error => console.error('Error fetching country data:', error));
}

function filterByCountry() {
  var selectedCountry = document.getElementById("countrySelect").value;
  var apiUrl = selectedCountry === "all"
    ? "https://restcountries.com/v3.1/all"
    : `https://restcountries.com/v3.1/name/${selectedCountry}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => displayCountryDetails2(data))
    .catch(error => console.error('Error fetching country data:', error));
}

function displayCountryDetails2(countries) {
  var tableBody = document.querySelector("#countryTable tbody");
  tableBody.innerHTML = ""; 

  countries.forEach(country => {
    var row = tableBody.insertRow();

    var nameCell = row.insertCell(0);
    var codeCell = row.insertCell(1);
    var isoCell = row.insertCell(2);
    var populationCell = row.insertCell(3);
    var areaCell = row.insertCell(4);

    var currencyCell = row.insertCell(5);
    var regionCell = row.insertCell(6);
    var flagCell = row.insertCell(7); 

    nameCell.textContent = country.name.common;
    codeCell.textContent = country.cca2 || 'N/A';
    isoCell.textContent = country.cca3 || 'N/A';
    populationCell.textContent = country.population || 'N/A';
    areaCell.textContent = country.area || 'N/A';
    regionCell.textContent = country.region || 'N/A';

   
    [nameCell, codeCell, isoCell, populationCell, areaCell, currencyCell, regionCell, flagCell].forEach(cell => {
        cell.style.verticalAlign = "middle";
    });

    if (country.currencies) {
        var currenciesList = document.createElement("ul");
        for (const code in country.currencies) {
            if (country.currencies.hasOwnProperty(code)) {
                var currencyItem = document.createElement("li");
                currencyItem.textContent = `${code || 'N/A'}: ${country.currencies[code].name || 'N/A'}`;
                currenciesList.appendChild(currencyItem);
            }
        }
        currencyCell.appendChild(currenciesList);
    } else {
        currencyCell.textContent = 'N/A';
    }

    if (country.flags && country.flags.png) {
        var flagImg = document.createElement("img");
        flagImg.src = country.flags.png;
        flagImg.alt = `Flag of ${country.name.common}`;
        flagImg.classList.add("country-flag");
        flagCell.appendChild(flagImg);
    } else {
        flagCell.textContent = 'N/A';
    }
});
}
// random countries #####
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://restcountries.com/v3.1/all";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((countries) => {
      const countryList = document.getElementById("countryList");

      const randomCountries = getRandomCountries(countries, 12);

      randomCountries.forEach((country) => {
        const card = createCountryCard(country);
        countryList.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));

  function getRandomCountries(countries, count) {
    const shuffledCountries = countries.sort(() => 0.5 - Math.random());
    return shuffledCountries.slice(0, count);
  }

  function createCountryCard(country) {
    const card = document.createElement("div");
    card.classList.add("country-card");

    const flagImg = document.createElement("img");
    flagImg.src = country.flags.svg;
    flagImg.alt = `${country.name.common} Flag`;

    const cardBody = document.createElement("div");
    cardBody.classList.add("country-card-body");

    const title = document.createElement("h3");
    title.textContent = country.name.common;

    const population = document.createElement("p");
    population.textContent = `Population: ${country.population}`;

    const capital = document.createElement("p");
    capital.textContent = `Capital: ${country.capital}`;
    const showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show More";
    showMoreButton.classList.add("show-more-button");
    showMoreButton.onclick = () => {
      
      window.location.href = `country.html?country=${encodeURIComponent(country.name.common)}`;
    };
    cardBody.appendChild(title);
    cardBody.appendChild(population);
    cardBody.appendChild(capital);
    cardBody.appendChild(showMoreButton);

    card.appendChild(flagImg);
    card.appendChild(cardBody);

    return card;
  }
});


// weather html page

const apiKey = '6c64698dc5c9adcc83b19e5baf735ed3'; 
function searchWeatherbyCity() {
const city = document.getElementById('cityInput').value;

if (!city) {
    alert('Please enter a city.');
    return;
}

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        displayWeather5(data);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    });
}

function displayWeather5(data) {
const weatherDataContainer = document.getElementById('weatherData5');
weatherDataContainer.innerHTML = '';

const cityName = data.name;
const temperature = data.main.temp;
const weatherDescription = data.weather[0].description;
const humidity = data.main.humidity;
const windSpeed = data.wind.speed;
const country = data.sys.country;




let weatherImage;
if (temperature > 295) {
    weatherImage = 'images/sunny.png';
} else if (temperature > 293) {
    weatherImage = 'images/rainy.png';
    
}
else if (temperature > 20) {
    weatherImage = 'images/cold.jfif';
}

const imgElement = document.createElement('img');
imgElement.src = weatherImage;
imgElement.alt = 'Weather Image';
imgElement.style.maxWidth = '50%'; 
imgElement.style.height = 'auto'; 


document.getElementById('weatherData5').appendChild(imgElement); 
const weatherHTML = `
    <div class="weather-card">
        <h2>Current Weather Data</h2>
        <div class="weather-details">
            <h3>${cityName}, ${country}</h3>
            
            <p>Temperature: ${temperature} &deg;F</p>
            <p>Weather: ${weatherDescription}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <img src="${weatherImage}" alt="Weather Image">
        </div>
    </div>
`;

weatherDataContainer.innerHTML = weatherHTML;
}

function searchWeatherForecastByCity() {
const apiKey = '6c64698dc5c9adcc83b19e5baf735ed3'; 
const city = document.getElementById('cityInput2').value;

if (!city) {
    alert('Please enter a city.');
    return;
}

const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        displayForecastDetails5(data);
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
        alert('Error fetching forecast data. Please try again.');
    });
}

function displayForecastDetails5(data) {
  console.log(data); 

  const forecastDataContainer = document.getElementById('weatherData6');
  forecastDataContainer.innerHTML = '';

  const cityName = data.city.name;
  const country = data.city.country;

  const forecastList = data.list;

  forecastList.forEach(item => {
      const forecastTime = new Date(item.dt * 1000);
      const temperature = item.main.temp;
      const weatherDescription = item.weather[0].description;
      const humidity = item.main.humidity;
      const windSpeed = item.wind.speed;
      const cloudiness = item.clouds.all;

      let weatherImage;
      if (temperature > 295) {
          weatherImage = 'images/sunny.png';
      } else if (temperature > 293) {
          weatherImage = 'images/rainy.png';
      } else if (temperature > 20) {
          weatherImage = 'images/cold.jfif';
      }

      const forecastHTML = `
          <div class="forecast-card2">
              <img src="${weatherImage}" alt="Weather Image" >
              <h3>${formatDateTime(forecastTime)}</h3>
              <h5>Date: ${formatDate(forecastTime)}</h5>
              <p>Temperature: ${temperature} &deg;F</p>
              <p>Weather: ${weatherDescription}</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind Speed: ${windSpeed} m/s</p>
              <p>Cloudiness: ${cloudiness}%</p>
          </div>
      `;

      forecastDataContainer.innerHTML += forecastHTML;
  });
}

function formatDateTime(date) {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC' };
  return date.toLocaleTimeString('en-US', options);
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
// slider


