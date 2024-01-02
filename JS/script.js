var searchInput = $('#search-input');
var searchBtn = $('#search-btn');
var apiKey = 'e9dd823f996631a8acc598c7c9e0c07d';
var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?appid=e9dd823f996631a8acc598c7c9e0c07d&units=imperial&';
var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=atlanta&appid=e9dd823f996631a8acc598c7c9e0c07d&units=imperial&';

function getSearchHistory() {
  var rawData = localStorage.getItem('search-history');
  var history = JSON.parse(rawData) || [];
  return history;
}

function displayCurrentWeather(data) {
  
  var cityName = data.name;
  var date = new Date(data.dt * 1000).toLocaleDateString();
  var icon = data.weather[0].icon;
  var temperature = data.main.temp;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  
  $('#city-name').text(cityName);
  $('#date').text(date);
  $('#weather-icon').attr('src', `http://openweathermap.org/img/w/${icon}.png`);
  $('#temperature').text(temperature);
  $('#humidity').text(humidity);
  $('#wind-speed').text(windSpeed);
}

function displayForecast(data) {
  
  var forecast = data.list;

  
  for (var i = 0; i < forecast.length; i++) {
    var forecastObj = forecast[i];
    var date = new Date(forecastObj.dt * 1000).toLocaleDateString();
    var icon = forecastObj.weather[i].icon;
    var temperature = forecastObj.main.temp;
    var humidity = forecastObj.main.humidity;
    var windSpeed = forecastObj.wind.speed;

    
    $('#forecast-date-' + i).text(date);
    $('#forecast-icon-' + i).attr('src', `http://openweathermap.org/img/w/${icon}.png`);
    $('#forecast-temperature-' + i).text(temperature);
    $('#forecast-humidity-' + i).text(humidity);
    $('#forecast-wind-speed-' + i).text(windSpeed);
  }
}

function getCurrentForecast() {
  var cityName = searchInput.val();
  var history = getSearchHistory();

  if (!history.includes(cityName)) {
    history.push(cityName);
    localStorage.setItem('search-history', JSON.stringify(history));
  }

  $.get(currentUrl + `q=${cityName}`)
    .then(function(data) {
      displayCurrentWeather(data);
    });

  $.get(forecastUrl + `q=${cityName}`)
    .then(function(data) {
      displayForecast(data);
    });
}

function renderSearchHistory(history) {
  
  var historyList = $('#search-history');

  
  historyList.empty();

  
  for (var i = 0; i < history.length; i++) {
    var city = history[i];

    
    var listItem = $('<li>').text(city);

    
    listItem.on('click', function() {
      var clickedCity = $(this).text();
      getCurrentForecast(clickedCity);
    });

    
    historyList.append(listItem);
  }
}

searchBtn.on('click', function(event) {
  event.preventDefault();
  getCurrentForecast();
});


var history = getSearchHistory();
renderSearchHistory(history);