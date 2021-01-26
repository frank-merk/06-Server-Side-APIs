// functions to write local storage and get local storage

// function to handle search input and do a query of open weather

// function to write 5 day forecast

// function to write previously searched cities

// error handler

// Ajax to pull API

var cities = [];


$(".btn").on("click", function(event) {
    event.preventDefault();
    var APIKey = "fecb5e83c287868897c1ddcf3fb5404f";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Minneapolis&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
      });
    
});