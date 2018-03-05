
// Submit Button handler
function handleSubmit() {
  // @TODO: YOUR CODE HERE
  // Prevent the page from refreshing
  Plotly.d3.event.preventDefault();

  // Select the input value from the form
  var city = Plotly.d3.select("#exampleInputName2").node().value;

  console.log(city);
  // clear the input value
  Plotly.d3.select("#exampleInputName2").node().value = "";
  // Build the plot with the new stock
  buildPlotTemp(city);
  buildMap(city);
}


function buildPlotTemp(city) {
  var units = "imperial";
  var apiKey = "50e3d73beef796a3c10e716909fb6a2a";
  var url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=json&appid=${apiKey}&units=${units}`;
  console.log(url)

  Plotly.d3.json(url, function (error, response) {

    if (error) return console.warn(error);

    // Grab values from the response json object to build the plots
    var datesUnix = response.list.map(row => row.dt_txt)
    var temp = response.list.map(row => row.main.temp);
    var humidity = response.list.map(row => row.main.humidity);
    var wind = response.list.map(row => row.wind.speed);
    var weather = response.list.map(row => row.weather[0].description);

    buildTable(datesUnix, temp, humidity, wind, weather);

    var trace1 = {
      type: "bar",
      name: 'Temperature',
      text: weather,
      x: datesUnix,
      y: temp,
      textposition: 'auto',
      textfont: {
        color: 'white'
      }

    };

    var trace2 = {
      type: "scatter",
      x: datesUnix,
      y: wind,
      name: 'Wind Speed',

    };

    var trace3 = {
      type: "scatter",
      x: datesUnix,
      y: humidity,
      name: 'Humidity, %'
    };


    var data = [trace1, trace2, trace3];

    var layout = {
      title: `Weather forecast for the city of ${city}`,
      xaxis: {
        type: "date",
        title: "Coordinated Universal Time (UTC)",
        tickangle: -45
      },
      showlegend: false,
      margin: {
        l: 20,
        r: 10,
        b: 60,
        t: 20
      },
      font: {
        family: 'PT Sans, sans-serif',
        size: 10,
      }

    };

    Plotly.newPlot("plotTemp", data, layout);


  })
};


function buildTable(datesUnix, temp, humidity, wind, weather) {
  var table = Plotly.d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < datesUnix.length; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(datesUnix[i]);
    trow.append("td").text(temp[i]);
    trow.append("td").text(humidity[i]);
    trow.append("td").text(wind[i]);
    trow.append("td").text(weather[i])
  }
};


function buildMap(city) {
  var apiKey = "AIzaSyBPtERPD47WmGx7r91ibrHiC_lRpcT99Xo";
  var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${apiKey}`
  console.log(url)
  Plotly.d3.json(url, function (error, response) {

    if (error) return console.warn(error);

    debug = response;

    // Grab values from the response json object to build the plots
    var latitude = response.results[0].geometry.location.lat;
    var longitude = response.results[0].geometry.location.lng;
    var formatted_address = response.results[0].formatted_address;

    var data = [{
      type: 'scattermapbox',
      lat: [latitude],
      lon: [longitude],
      mode: 'markers',
      marker: {
        color: '#D12D33',
        symbol: 'circle',
        size: 16
      },
      text: [formatted_address]
    }]

    var layout = {
      hovermode: 'closest',

      mapbox: {
        style: 'mapbox://styles/mapbox/bright-v9',
        center: {
          lat: latitude,
          lon: longitude
        },
        pitch: 60, // pitch in degrees
        zoom: 8

      },
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
      },
    }

    Plotly.setPlotConfig({
      mapboxAccessToken: 'pk.eyJ1IjoiYXNlbGExOTgyIiwiYSI6ImNqZDNocXRlNTBoMWEyeXFmdWY1NnB2MmIifQ.ziEOjgHun64EAp4W3LlsQg'
    })

    Plotly.plot('plotMap', data, layout)

  })
};


// Add event listener for submit button
var $btn = Plotly.d3.select(".btn");
$btn.on("click", handleSubmit);

