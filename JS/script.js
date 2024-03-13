var searchInput = $('#search-input');
var searchBtn = $('#search-btn');
var currentEl = $('#current-weather')
var forecastEl = $('#forecast')
var apiKey = 'e9dd823f996631a8acc598c7c9e0c07d';
var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?appid=e9dd823f996631a8acc598c7c9e0c07d&units=imperial&';
var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=e9dd823f996631a8acc598c7c9e0c07d&units=imperial&';
var historyList = $('#search-history');

function getSearchHistory() {
  var rawData = localStorage.getItem('search-history');
  var history = JSON.parse(rawData) || [];
  return history;
}

function saveSearchHistory(history) {
  localStorage.setItem('search-history', JSON.stringify(history));
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
  $('#temperature').text('Temperature(F): ' + temperature);
  $('#humidity').text('Humidity: ' + humidity);
  $('#wind-speed').text('Wind(mph)' + windSpeed);

  currentEl.removeClass('hide');
}

function displayForecast(data) {
  var forecast = data.list;

  for (var i = 0; i < forecast.length; i++) {
    // var forecastObj = forecast[i * 8];
    var forecastObj = forecast[i];
    var time = forecastObj.dt_txt;

    if (time.includes('12:00')) {
      var date = new Date(forecastObj.dt * 1000).toLocaleDateString();
      var icon = forecastObj.weather[0].icon;
      var temperature = forecastObj.main.temp;
      var humidity = forecastObj.main.humidity;
      var windSpeed = forecastObj.wind.speed;

      $('#forecast-output').append(`
      <div>
          <p>${date}</p>
          <img src="${`http://openweathermap.org/img/w/${icon}.png`}" alt="Weather Icon">
          <p>Temp: ${temperature}</p>
          <p>Humidity: ${humidity}</p>
          <p>Wind: ${windSpeed} mph</p>
      </div>
      
      `);
      
    }
    
    // forecastContainer.append(date, icon, temperature, humidity, windSpeed);

    // Append forecast container to the page
    // $('#forecast-container').append(forecastContainer);
  }
  forecastEl.removeClass('hide');
}

function getCurrentForecast(cityName) {
  var history = getSearchHistory();

  if (!history.includes(cityName)) {
    history.push(cityName);
    saveSearchHistory(history);
  }

  $.get(currentUrl + `q=${cityName}`)
    .then(function (data) {
      displayCurrentWeather(data);
    });

  $.get(forecastUrl + `q=${cityName}`)
    .then(function (data) {
      displayForecast(data);
    });
}

function renderSearchHistory() {
  var history = getSearchHistory();
  historyList.empty();

  for (var i = 0; i < history.length; i++) {
    var city = history[i];
    var buttonItem = $('<button>').text(city);

    buttonItem.on('click', function () {
      var clickedCity = $(this).text();
      getCurrentForecast(clickedCity);
    });

    historyList.append(buttonItem);
  }
}

searchBtn.on('click', function (event) {
  event.preventDefault();
  var cityName = searchInput.val();
  getCurrentForecast(cityName);
  renderSearchHistory();
});

// Initial rendering of search history
renderSearchHistory();