mapbox.accessToken = 'pk.eyJ1IjoibW9ycmlzLXNlbGEiLCJhIjoiY2xiZnp2eGN5MGI0dDNwcXBjaW83a2RhbSJ9.eKowJ_pWUW4XnfTRWRvPFQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [41.86185593476405, -87.66094255027956],
    zoom: 10
  });
  
  (async function fetchData(dataArray = []) {
    // Performs a fetch request with the passed URL and returns the data as text asynchronously
    const makeRequest = async function (url) {
      const response = await fetch(url);
      const data = await response.text();
      return data;
    };
    
var markers = [];


// Add bus markers to map
async function run(){
	// get bus data
	const locations = await getBusLocations();
    console.log(new Date());
    console.log(locations);

	// loop through data, add bus markers
	locations.forEach(function(bus){
		let marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(run,15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	let url = 'https://www.ctabustracker.com/bustime/api/v2/getvehicles?key=DbVzT7rgSLcPh3XduZjZ2RDnB&rt=18&format=json';	
	let response = await fetch(url);
	let json     = await response.json();
	return json.data;
}


var marker = new mapboxgl.Marker()
        .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
        .addTo(map);
    markers.push(marker);
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}


window.onload = init;
