var map;
var place;
var autocomplete;
var infowindow = new google.maps.InfoWindow();

console.log("(loadmap.js:) calling initialization() line 6");
function initialization() {
    showAllReports();
    initAutocomplete();
    onPlaceChanged();
}
console.log("(loadmap.js:) calling showAllReports() line 12");
function showAllReports() {
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: { "tab_id": "1"},
        success: function(reports) {
            //alert("Success! All reports shown");
            mapInitialization(reports);
            console.log('loadmap line 21 mapinit successful');
        },
        error: function(xhr, status, error) {
            alert("An AJAX error occured: " + status + "\nError: " + error);
        }
    });
}

function mapInitialization(reports) {
    console.log("(loadmap.js:) calling map options variable line 28");
    var mapOptions = {
        mapTypeId : google.maps.MapTypeId.ROADMAP, // Set the type of Map
    };

    // Render the map within the empty div
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var bounds = new google.maps.LatLngBounds ();
    console.log("(loadmap.js:) var bounds defined variable line 36");
    $.each(reports, function(i, e) {
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        var latlng = new google.maps.LatLng(lat, long);

        bounds.extend(latlng);

        // Create the infoWindow content
        var contentStr = '<h4>Report Details</h4><hr>';
        contentStr += '<p><b>' + 'Disaster' + ':</b>&nbsp' + e['disaster'] + '</p>';
        contentStr += '<p><b>' + 'Report Type' + ':</b>&nbsp' + e['report_type'] +
            '</p>';
        if (e['report_type'] == 'request' || e['report_type'] == 'donation') {
            contentStr += '<p><b>' + 'Resource Type' + ':</b>&nbsp' +
                e['resource_type'] + '</p>';
        }
        else if (e['report_type'] == 'damage') {
            contentStr += '<p><b>' + 'Damage Type' + ':</b>&nbsp' + e['damage_type']
                + '</p>';
        }
        //adding reporter info for first name and last name here:
        contentStr += '<p><b>' + 'Reporter' + ':</b>&nbsp' + e['first_name'] + ' ' + e['last_name'] + '</p>';
        //console.log("(loadmap.js:) defining contentstr variable at timestamp line 59");
        contentStr += '<p><b>' + 'Timestamp' + ':</b>&nbsp' +
            e['time_stamp'].substring(0,19) + '</p>';
        //console.log("(loadmap.js:) defined contentstr variable at timestamp line 59");
        if ('message' in e){
            contentStr += '<p><b>' + 'Message' + ':</b>&nbsp' + e['message'] + '</p>';
        }

        function getIcon(){
            switch (e['report_type']) {
                case "request": return "img/donation.png";
                case "donation": return "img/shake-hands.png";
                case "damage": return "img/warning.png";
            }
        }

        // Create the marker
        var marker = new google.maps.Marker({ // Set the marker
            position : latlng, // Position marker to coordinates
            map : map, // assign the market to our map variable
            //icon: icons[(e['report_type'])].icon,
            icon: getIcon(),
            customInfo: contentStr
        });
        //checking and debugging with  console log
        console.log (e['report_type']);
        // Add a Click Listener to the marker
        google.maps.event.addListener(marker, 'click', function() {
            // use 'customInfo' to customize infoWindow
            infowindow.setContent(marker['customInfo']);
            infowindow.open(map, marker); // Open InfoWindow
        });

    });

    map.fitBounds (bounds);

}

function initAutocomplete() {
    // Create the autocomplete object
    autocomplete = new google.maps.places.Autocomplete(document
        .getElementById('autocomplete'));

    // When the user selects an address from the dropdown, show the place selected
    autocomplete.addListener('place_changed', onPlaceChanged);
}

// function onPlaceChanged() {
//     place = autocomplete.getPlace();
// //setting pan to function
//     if (place.geometry) {
//         map.panTo(place.geometry.location);
//         map.setZoom(14);
//         search();
//     }   else {
//         document.getElementById("autocomplete").placeholder = "Enter a valid location";
//     }
// }
function onPlaceChanged() {
    var address = new google.maps.Marker({
        map: map
    });
    address.setVisible(false);
    place = autocomplete.getPlace();
    map.fitBounds(place.geometry.viewport);
    address.setPosition(place.geometry.location);
    address.setVisible(true);
}

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);