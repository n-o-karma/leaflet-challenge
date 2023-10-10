const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(function(data){
    createFeatures(data.features);
});

let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function createFeatures(earthquakeData) {

    function getColor(depth){
        if (depth > -10 & depth < 10){
            return 'green'
        }
        else if(depth > 10 & depth < 30){
            return 'lime'
        }
        else if(depth > 30 & depth < 50){
            return 'orange'
        }
    }
    for (let i = 0; i < earthquakeData.length; i++) {
            L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
            fillOpacity: 0.5,
            color: getColor(earthquakeData[i].geometry.coordinates[2]),
            fillColor: getColor(earthquakeData[i].geometry.coordinates[2]),
            radius: earthquakeData[i].properties.mag * 20000
            }).bindPopup(`<h2>${earthquakeData[i].properties.place}</h2> <hr> <h3>Magnitude: ${earthquakeData[i].properties.mag}</h3> <h3>Depth: ${earthquakeData[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
      }
}
