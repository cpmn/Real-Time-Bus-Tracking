
var myIcon =[ 
    L.icon({iconUrl: './images/bus_red.png'}), 
    L.icon({iconUrl: './images/bus_blue.png'}),
    L.icon({iconUrl: './images/bus_yellow.png'}),
    L.icon({iconUrl: './images/bus_black.png'}),
    L.icon({iconUrl: './images/bus_brown.png'}),
    L.icon({iconUrl: './images/bus_fuxia.png'}),
    L.icon({iconUrl: './images/bus_skyblue.png'}),
    L.icon({iconUrl: './images/bus_green.png'}),
    L.icon({iconUrl: './images/bus_orange.png'})
];

var map = L.map('map').setView([42.353350,-71.091525], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xhdWRpYS1wYW9sYSIsImEiOiJjbDMyZTdvODQwM3AxM2lzOG02MHlvZnhhIn0.pFjq0r23WnlpQXMspTXCZA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2xhdWRpYS1wYW9sYSIsImEiOiJjbDMyZTdvODQwM3AxM2lzOG02MHlvZnhhIn0.pFjq0r23WnlpQXMspTXCZA'
}).addTo(map);


var markers = [];

function getRandomIcon()
{
    const rndInt = Math.floor(Math.random() * 9);
    return myIcon[rndInt];
}

// Request bus data
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function getBus(id){
	let bus = markers.find(function(item){
		return item.id === id;
	});
	return bus;
}

async function addMarkersToMap(){    
    
    var locations = await getBusLocations();
    
	// loop through data, add bus markers
    if (markers.length === 0){
        //loop throug bus locations and add those to markers
        locations.forEach(bus => {        
            let marker = L.marker([bus.attributes.latitude,bus.attributes.longitude], {icon: getRandomIcon()});
            markers.push({
                id: bus.id, 
                marker: marker
            });
            marker.addTo(map);
            marker.bindTooltip(bus.id).openTooltip();
        });
    }else{
        //loop throug existing bus and update position
        locations.forEach(bus => {
            let vehicle = getBus(bus.id);
            let marker = vehicle.marker;
            marker.setLatLng([bus.attributes.latitude,bus.attributes.longitude]);
            marker.addTo(map);
            marker.bindTooltip(bus.id).openTooltip();
        });
    }    
	console.log(new Date());
    console.log(markers);
	setTimeout(addMarkersToMap,5000);
}

addMarkersToMap();



