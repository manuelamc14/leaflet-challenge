// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

console.log("hello world")
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

// Function that will give the markers a bigger size

function markerSize(mag) {
  return mag * 30000;
}

// Function that will determine the color and the size of the data points
  
  function chooseColor(depth){
    console.log(depth)
      switch (true) {
      case (depth < 10):
        return "#affc08";
      case (depth >= 10):
        return "#f0fc08";
      case (depth >= 30):
        return "#fcc708";
      case (depth >= 50):
        return "#fca308";
      case (depth >= 70):
        return "#fc6e08";
      case (depth >= 90):
        return "#fc3d08";
      default:
          return "black";
      }
   
  }

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  
  // Give each feature a popup describing the place and time of the earthquake

  function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + 
      "<p> Magnitude: " +  feature.properties.mag + "</p>");
  }
  
  // Create a function for the circle markers

  function pointToLayer(feature, latlng) {
    return L.circle(latlng,           
      {radius: markerSize(feature.properties.mag),
      color: "black", 
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      fillOpacity: 1,
      stroke:true, 
      weight: 1
    });
  }
  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v9",
      accessToken: API_KEY
  });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Dark Map": darkmap,
        "Light Map": lightmap,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
          37.09, -95.71
        ],
        zoom: 3,
        layers: [darkmap, earthquakes]
      });

    // Create  a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed:false
    }).addTo(myMap);
    
    // Create a legend control
    var legend = L.control({position:'bottomright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i=0; i < grades.length; i++){
      div.innerHTML +=
         '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
         grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
}