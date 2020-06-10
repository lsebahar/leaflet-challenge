
// establish URL
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Test API call
function printSomething() {
  d3.json(URL, function(data) {
    console.log(data.features)});
}
printSomething();

// Pass data
d3.json(URL, function(data) {
  popFeatures(data.features)
}
);


// Create function that determines bubble size (would like to use case/switch)
function bubbleSize(magnitude) {
  // switch(magnitude) {
  //   case (magnitude < 1): return 10;
  //   case (magnitude < 2): return 20;
  //   case (magnitude < 3): return 30;
  //   case (magnitude < 4): return 40;
  //   case (magnitude < 5): return 50;
  //   case (magnitude < 10): return 60
  // }
  if (magnitude < 1) { 
    return 5;}
  else if (magnitude <2) {
    return 10;}
  else if (magnitude <3) {
    return 15;}
  else if (magnitude <4) {
    return 20;}
  else if (magnitude <5) {
      return 25;}
  else 
      {return 30;}
};

// Create function that determines bubble color  (would like to use case/switch)
function bubbleColor(magnitude) {
  if (magnitude < 1) { 
    return "#7FFF00";}
  else if (magnitude <2) {
    return "#ADFF2F";}
  else if (magnitude <3) {
    return "#FFD700";}
  else if (magnitude <4) {
    return "#FFA500";}
  else if (magnitude <5) {
      return "#FF8C00";}
  else
      {return "#FF4500";}
  
  // switch(magnitude) {
  //   case (magnitude < 1): return '#D4EFDF';
  //   case (magnitude < 2): return '#AED6F1';
  //   case (magnitude < 3): return '#F7DC6F';
  //   case (magnitude < 4): return '#C39BD3';
  //   case (magnitude < 5): return '#EC7063';
  //   case (magnitude < 10): return '#95A5A6';
  };



// Binding popup to features in the data
function popFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.title +
  "</h3><hr><p>" + new Date(feature.properties.time) + "<p>")
}

  function pointToLayer (feature, latlng) {
    return new L.CircleMarker(latlng, {
    radius: bubbleSize(feature.properties.mag),
    fillColor: bubbleColor(feature.properties.mag),
    color: "#000000",
    weight: 1,
    fillOpacity: 1
});
};
// Making GeoJSON layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    });

// Creating map with new layer
  createMap(earthquakes);

};

// Creating function which creates & organizes layers
function createMap(earthquakes) {

  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      accessToken: "pk.eyJ1IjoiYWx4cHJ5IiwiYSI6ImNrYW9saHZjNDA0Z3ozMG82cHZpcm0xbm8ifQ.yM3ZhZhGelQpcJBz0wtaiw"
  });

  var baseMap = {
      "Light Map": lightmap
  };

  var topMap = {
      Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
      center:[
          40.09, -110.71
        ],
        zoom: 5,
        layers: [lightmap, earthquakes]
      });
    
  L.control.layers(baseMap, topMap, {
      collapsed: false
      }).addTo(myMap);

// Create legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var magScale = [0, 1, 2, 3, 4, 5]

  // Generating label for intervals
  for (var i = 0; i < magScale.length; i++) {
      div.innerHTML +=
          '<i style="background:' + markerColor(magScale[i]) + '"></i> ' +
          magScale[i] + (magScale[i + 1] ? '&ndash;' + magScale[i + 1] + '<br>' : '+');
  }

  return div;
};

// Appending legend to map
legend.addTo(myMap);

  }




