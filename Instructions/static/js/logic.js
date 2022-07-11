var earthquakeUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function onEachFeature(feature, layer) {
    // does this feature have a property named mag?
    if (feature.properties && feature.properties.place) {
        layer.bindPopup('' + feature.properties.place + feature.properties.mag + ' ' +feature.geometry.coordinates[2]);
    }
}

var map = L.map('map').setView([39.74739, -105], 5);

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

Plotly.d3.json(earthquakeUrl, function(error, response) {
    // console.log(error);
    L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*8,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color:'#ff7800',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    }).addTo(map);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 20, 40, 60, 80, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            (grades[i]-10) + (grades[i + 1] ? '&ndash;' + (grades[i]+10) + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

function getColor(coordinate) {
    return coordinate > 90 ? '#800026' :
    coordinate > 70 ? '#BD0026' :
    coordinate > 50 ? '#E31A1C' :
    coordinate > 30 ? '#FC4E2A' :
    coordinate > 10 ? '#FD8D3C' :
                    '#FEB24C';
}
    legend.addTo(map);

