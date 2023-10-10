const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(function(data){
    createFeatures(data.features);
});

let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function createFeatures(earthquakeData) {

    function getColor(depth){
        if (depth >= -10 & depth <= 10){
            return 'lime'
        }
        else if(depth >= 10 & depth <= 30){
            return 'green'
        }
        else if(depth >= 30 & depth <= 50){
            return 'yellow'
        }
        else if(depth >= 50 & depth <= 70){
            return 'orange'
        }
        else if(depth >= 70 & depth <= 90){
            return 'chocolate'
        }
        else if(depth >= 90){
            return 'red'
        }
    }

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10,10,30,50,70,90];
      let colors = ["lime","green","yellow","orange","chocolate","red"];
      let labels = [];

      let legendInfo = "<h3>Depth</h3>" + "<div class=\"labels\">" + "</div>";
      div.innerHTML = legendInfo;

      for (let i = 0; i < limits.length; i++) {
          let lower = limits[i];
          let upper = limits[i + 1];
          labels.push(`<li style="background:${colors[i]}"></li> ${lower}${upper ? `&ndash;${upper}` : '+'}`);
      }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    };
  
    legend.addTo(myMap);

    for (let i = 0; i < earthquakeData.length; i++) {
            L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], 
                {fillOpacity: 0.5,
                color: getColor(earthquakeData[i].geometry.coordinates[2]),
                fillColor: getColor(earthquakeData[i].geometry.coordinates[2]),
                radius: earthquakeData[i].properties.mag * 20000
                }).bindPopup(`<h2>${earthquakeData[i].properties.place}</h2> 
                <h2>${earthquakeData[i].geometry.coordinates}</h2>
                <hr>
                <h3>Magnitude: ${earthquakeData[i].properties.mag}</h3> 
                <h3>Depth: ${earthquakeData[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
      }
}
