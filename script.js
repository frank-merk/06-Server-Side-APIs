// set up Luxon's DateTime w/CDN
var DateTime = luxon.DateTime;
// Get the local current date and time
var dt = DateTime.local();
// store the current date as a string, displaying month, date, and year
var currentDate = dt.toLocaleString(DateTime.DATE_SHORT);

// Blank screen to start, when the user will enter data
$(".weather-area").hide();

// placeholder cities in the array
var cities = ["Los Angeles", "Minneapolis", "Chicago", "New York"];
var city = "";

// function to get existing user data and store user input
function saveCity(data) {
  var cities = [];
    
    cities = JSON.parse(localStorage.getItem('cities')) || [];
    
    cities.push(data);
    
    localStorage.setItem('cities', JSON.stringify(cities));
}

// gets the city from local storage for the sidebar
function getCity() {
  
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  console.log(storedCities);
  // Filtering out duplicate cities that might be in the array, so each city gets one button
  var uniqueCities = [];
  $.each(storedCities, function(j, el){
    if($.inArray(el, uniqueCities) === -1) uniqueCities.push(el);
  });
  
  console.log(uniqueCities);
  for (i = 0; i < uniqueCities.length; i++) {
    // throw away the empty ones
    if (uniqueCities[i] === null) {
      uniqueCities[i] = "";
    } else {
      // valid cities get prepended as a list item
    var newCityButton = $("<li>");
    newCityButton.text(uniqueCities[i]);
    newCityButton.attr("class", "city-button")
    $("#previous-search").prepend(newCityButton);
    }
  }
}

// call the function
getCity();

// when a user clicks the city, it populates the city variable to send into the main weather function
$(".city-button").on("click", function(event, city){
  event.preventDefault();
  // gets the text of the element clicked on
  city = $(this).text();
  console.log(city);
  weather(city);
});

// Main search button ajax call
$(".btn").on("click", function(event) {
    event.preventDefault();
    // gets the city value input
    city = $("#city").val().trim();
    // debugging
    cities.push(city); 
    console.log(city);
    console.log(cities);
    // sends the city info in and runs the weather function
    weather(city);
    // Same deal as before, to prepend a new city button based on user input, and throw away empty strings
    var newCityButton = $("<li>");
    newCityButton.attr("class", "city-button");
    if (city === "") {
      return;
    } else {
      newCityButton.text(city);
      $("#previous-search").prepend(newCityButton);
    }
});

// Main function with AJAX calls. Takes an input of "city"
function weather(city) {

  // Open weather api key
  var APIKey = "fecb5e83c287868897c1ddcf3fb5404f";
  // query url for main weather
  var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  // query url for forecast
  var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

  // ajax with error handling
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
      // show the main content area
      $(".weather-area").show();
      // save the input city to local storage
      saveCity(city);
      // don't do anything if city is blank
      if (city === "") {
        return;
      } else {
        // debug
        console.log(response);

        // process api paramaters
        var temp = Math.round(response.main.temp * (9/5) - 459.67) + "°F";
        var humidity = response.main.humidity + "%";
        var wind = Math.round(response.wind.speed) + " MPH";

        // Get icon ID and use that to make a source url
        var iconId = response.weather[0].icon;
        var iconSrc = "https://openweathermap.org/img/w/" + iconId + ".png";
        $(".icon").attr("src", iconSrc);

        //Start populating some text on the page, this is the header
        $("#current-city").text(city + " weather for " + currentDate)  ;

        // weather details here
        $("#temp").text("Temperature: " + temp);
        $("#humidity").text("Humidity: " + humidity);
        $("#wind").text("Wind: " + wind);
          
        // debug
          console.log(temp);
          console.log(humidity);
          console.log(wind);
        // for the uv index, we need lat and longitude paramaters, which we pull from the main weather api
          var lon = response.coord.lon;
          var lat = response.coord.lat;
        // use those params to generate a new query url
          var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
          // use that query url for a nested ajax call for the UV index
          $.ajax({
              url: queryURLUV,
              method: "GET"
            }).then(function(response) {
              console.log(response);
              var UV = response.value.toFixed(1);
              console.log(UV);
              $("#UV").text("UV Index: " + UV);
          });

          // second ajax call for the daily forecast using that query url above
          $.ajax({
            url: forecastQueryURL,
            method: "GET"
          }).then(function(response) {
            console.log(response);

            // if there's anything in the forecast area, dump it
            $(".five-day-forecast").empty();

            // time of day list from the api
            var dateTimes = response.list;
            // gets us the weather at noon on each day
            for (i = 4; i < 37; i = i + 8) {
              
              // text value of the date/time from the api
              var date = dateTimes[i].dt_txt;
              // use luxon to convert it from a sql string to a locale string, displayed as luxon Date_short
              var display = DateTime.fromSQL(date).toLocaleString(DateTime.DATE_SHORT);
              console.log(display);

              // get the weather params, just like before, but this time, via for loop for five day forecast
              var newIcon = dateTimes[i].weather[0].icon;
              var newIconURL = "http://openweathermap.org/img/w/" + newIcon + ".png";
              var newTemp = Math.round(dateTimes[i].main.temp * (9/5) - 459.67) + " °F";
              var newHumidity = "Humidity " + dateTimes[i].main.humidity + "%";
              var newWind = "Wind: " + Math.round(dateTimes[i].wind.speed) + " MPH";

              console.log(newTemp);
              console.log(newHumidity);
              console.log(newWind);
              
              // create a new bootstrap card el, and append our weather params to it
              var newDateCard = $("<div>");
              newDateCard.attr("class", "col-md-2 new-date-card");
              newDateCard.html("<h4>" + display + "</h4>" + "<img alt = 'icon' src = '" + newIconURL + "' />" + "<p>" + newTemp + "</p>" + "<p>" + newHumidity + "</p>" + "<p>" + newWind + "</p>");
              
              // write all that content to the page
              $(".five-day-forecast").append(newDateCard);
            }
        
          });
      }  
    });
  }
