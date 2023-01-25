	let map; 
        let markers = [];

        function init(){
            mapboxgl.accessToken = 'pk.eyJ1IjoibW9ycmlzLXNlbGEiLCJhIjoiY2xiZnp2eGN5MGI0dDNwcXBjaW83a2RhbSJ9.eKowJ_pWUW4XnfTRWRvPFQ';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v11',
                center: [41.86185593476405, -87.66094255027956],
                zoom: 10
            });
            addMarkers();
        }
    
        // Add bus markers to map
        async function addMarkers(){
	        // get bus data
	        let locations = await getBusLocations();
            // loop through data, add bus markers
            locations.forEach(function(vehicle){
                let marker = getMarker(vehicle.vid);		
                    if (marker){
                    moveMarker(marker,vehicle);
                    }else{
                    addMarker(vehicle);			
                    }
        });

        // timer
        console.log(new Date());
        setTimeout(addMarkers,15000);
        }

        // Request bus data from MBTA
        async function getBusLocations(){
            let url = 'https://www.ctabustracker.com/bustime/api/v2/getvehicles?key=DbVzT7rgSLcPh3XduZjZ2RDnB&rt=18&format=json';	
            let response = await fetch(url, {mode: 'no-cors'});
            let json     = await response.json();
            return json.data;
        }

        function addMarker(vehicle){
            let icon = getIcon(vehicle);
            let marker = new mapboxgl.Marker({
                position: {
                    lat: vehicle.attributes.lat, 
                    lng: vehicle.attributes.lon
                },
                map: map,
                icon: icon,
                id: vehicle.vid
            });
            markers.push(marker);
        }

        function getIcon(vehicle){
            // select icon based on bus direction
            if (vehicle.attributes.hdg === 0) {
                return 'red.png';
            }
            return 'blue.png';	
        }

        function moveMarker(marker,vehicle) {
            // change icon if bus has changed direction
            var icon = getIcon(vehicle);
            marker.setIcon(icon);

            // move icon to new lat/lon
            marker.setPosition( {
                lat: vehicle.attributes.lat, 
                lng: vehicle.attributes.lon
            });
        }

        function getMarker(vid){
            var marker = markers.find(function(item){
                return item.vid === vid;
            });
            return marker;
        }

        window.onload = init;
