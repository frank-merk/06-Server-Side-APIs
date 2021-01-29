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
var cities = ["Los Angeles", "Minneapolis", "Chicago", "New York"];
var city = "";


function saveCity(data) {
  var cities = [];
    
    cities = JSON.parse(localStorage.getItem('cities')) || [];
    
    cities.push(data);
    
    localStorage.setItem('cities', JSON.stringify(cities));
}

function getCity() {
  
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  console.log(storedCities);
  var uniqueCities = [];
  $.each(storedCities, function(j, el){
    if($.inArray(el, uniqueCities) === -1) uniqueCities.push(el);
  });
  
  console.log(uniqueCities);
  for (i = 0; i < uniqueCities.length; i++) {
    
    if (uniqueCities[i] === null) {
      uniqueCities[i] = "";
    } else {
    var newCityButton = $("<li>");
   
    
    newCityButton.text(uniqueCities[i]);
    newCityButton.attr("class", "city-button")
    
    $("#previous-search").prepend(newCityButton);
    }
  }
}

getCity();

$(".city-button").on("click", function(event, city){
  event.preventDefault();
  city = $(this).text();
  console.log(city);
  weather(city);
  
  
  
});

$(".btn").on("click", function(event) {
    event.preventDefault();
    city = $("#city").val().trim();
    cities.push(city); 
    console.log(city);
    console.log(cities);
    weather(city);
    var newCityButton = $("<li>");
    newCityButton.attr("class", "city-button");
    
    
    if (city === "") {
      return;
    } else {
     
      newCityButton.text(city);
      
      $("#previous-search").prepend(newCityButton);
      
      
    }
});


function weather(city) {

  var APIKey = "fecb5e83c287868897c1ddcf3fb5404f";
  var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

  $.ajax({
      url: weatherQueryURL,
      method: "GET",
      statusCode: {
        404: function (city) {
          alert("The city is mispelled or not in our weather database. Try another.");
          city = "";
          return city;
       
          
        },
        400: function () {
          alert("Please Enter A City");
          city = "";
          return city;
       
        },
        401: function (city) {
          alert("Please Enter A City");
          city = "";
          return city;
       
        } 
        
        
      }    
    }).then(function(response) {
      $(".weather-area").show();
      saveCity(city);
      if (city === "") {
        return;
      } else {
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
            $(".five-day-forecast").empty();
            var dateTimes = response.list;
            console.log(dateTimes);

            
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
              
              
              $(".five-day-forecast").append(newDateCard);
            }
        
          });
      }  
    });
  }
