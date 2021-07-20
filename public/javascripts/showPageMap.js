//const fishingHole = require("../../models/fishingHole");

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: fishinghole.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(fishinghole.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML (
            `<h5>${fishinghole.title}</h5><p>${fishinghole.location}</p>`
        )
    )
    .addTo(map);

   