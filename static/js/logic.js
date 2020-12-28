// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  
  // Give each feature a popup describing the place and time of the earthquake

  function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
  }
  
  // Function that will determine the color and the size of the data points
  
  function chooseColorSize(mag){
      switch (mag) {
      case (mag < 10):
        return "#affc08";
      case (mag >= 10):
        return "#f0fc08";
      case (mag >= 30):
        return "#fcc708";
      case (mag >= 50):
        return "#fca308";
      case (mag >= 70):
        return "#fc6e08";
      case (mag >= 90):
        return "#fc3d08"; 
      }
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthqueakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
  });
}