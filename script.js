// functions to write local storage and get local storage

// function to handle search input and do a query of open weather

// function to write 5 day forecast

// function to write previously searched cities

// error handler

// Ajax to pull API
// set up Luxon's DateTime w/CDN
var DateTime = luxon.DateTime;

// Get the local current date and time
var dt = DateTime.local();

// store the current date as a string, displaying month, date, and year
var currentDate = dt.toLocaleString(DateTime.DATE_SHORT);
var cities = [];


$(".btn").on("click", function(event) {
    event.preventDefault();

    var city = $("#city").val().trim();
    var APIKey = 
    "fecb5e83c287868897c1ddcf3fb5404f";

    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    $.ajax({
      url: weatherQueryURL,
      method: "GET",
      statusCode: {
          404: function() {
            alert("The city is mispelled or not in our weather database. Try another.");
          }
        }    
  });

    $.ajax({
        url: weatherQueryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        var temp = Math.round(response.main.temp * (9/5) - 459.67) + "°F";
        var humidity = response.main.humidity + "%";
        var wind = Math.round(response.wind.speed) + " MPH";

        var iconId = response.weather[0].icon;
        var iconSrc = "https://openweathermap.org/img/w/" + iconId + ".png";
        $(".icon").attr("src", iconSrc);

       $("#current-city").text(city + " weather for " + currentDate)  ;

       $("#temp").text("Temperature: " + temp);
       $("#humidity").text("Humidity: " + humidity);
       $("#wind").text("Wind: " + wind);
        
        console.log(temp);
        console.log(humidity);
        console.log(wind);

        var lon = response.coord.lon;
        var lat = response.coord.lat;

        var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

        $.ajax({
            url: queryURLUV,
            method: "GET"
          }).then(function(response) {
            console.log(response);
            var UV = response.value.toFixed(1);
            console.log(UV);
            $("#UV").text("UV Index: " + UV);
        });

      });

      $.ajax({
        url: forecastQueryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
    });
    
});