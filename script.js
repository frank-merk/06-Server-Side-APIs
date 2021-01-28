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

$(".weather-area").hide();
var cities = [];
function saveCity() {
  localStorage.setItem("cities", cities)
}

$(".btn").on("click", function(event) {
    event.preventDefault();

    var city = $("#city").val().trim();
    cities.push(city); 
    console.log(city);
    console.log(cities);
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
            
          },
          400: function() {
            alert("Please Enter A City");
            
          },
          401: function() {
            alert("Please Enter A City");
            
          }
        }    
    });

    

    $.ajax({
        url: weatherQueryURL,
        method: "GET"
      }).then(function(response) {
        $(".weather-area").show();
        saveCity();
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

        $.ajax({
          url: forecastQueryURL,
          method: "GET"
        }).then(function(response) {
          console.log(response);
          var dateTimes = response.list;
          console.log(dateTimes);

          var dateCard = [];
          for (i = 4; i < 37; i = i + 8) {
            var date = dateTimes[i].dt_txt;
            var display = DateTime.fromSQL(date).toLocaleString(DateTime.DATE_SHORT);
            console.log(display);
            var newIcon = dateTimes[i].weather[0].icon;
            var newIconURL = "http://openweathermap.org/img/w/" + newIcon + ".png";
            var newTemp = Math.round(dateTimes[i].main.temp * (9/5) - 459.67) + " °F";
            var newHumidity = "Humidity " + dateTimes[i].main.humidity + "%";
            var newWind = "Wind: " + Math.round(dateTimes[i].wind.speed) + " MPH";

            console.log(newTemp);
            console.log(newHumidity);
            console.log(newWind);
            
            var newDateCard = $("<div>");
            newDateCard.attr("class", "col-md-2 new-date-card");
            newDateCard.html("<h4>" + display + "</h4>" + "<img alt = 'icon' src = '" + newIconURL + "' />" + "<p>" + newTemp + "</p>" + "<p>" + newHumidity + "</p>" + "<p>" + newWind + "</p>");
            dateCard.push(newDateCard);
            
            $(".five-day-forecast").append(newDateCard);
          }
          console.log(dateCard);
      });
      });
    
});