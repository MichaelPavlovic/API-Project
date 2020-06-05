/******** ISS Tracker *******/
function initMap(){
    //create a new map
    var map = new google.maps.Map(document.getElementById("map"), {
        //setting a default location for when the page first loads
        center: {
            lat: 43.6532,
            lng: -79.3832
        },
        mapTypeId: "hybrid", 
        scrollwheel: false, //disable zoom by scrolling
        zoom: 4
    });

    //create a new marker
    var marker = new google.maps.Marker({
        //setting a default marker location for when the page first loads
        position: {
            lat: 43.6532,
            lng: -79.3832
        },
        map: map,
        icon: "images/iss.png" //custom icon (link to icon can be found in html footer)
    }); 

    //update the ISS location every 3 seconds
    setInterval(function(){
        //set the url location
        const url = "https://api.wheretheiss.at/v1/satellites/25544/";

        //make the request
        const request = new XMLHttpRequest();

        //send a request to the api url
        request.open("GET", url);
        request.send();

        //add an event listener for when the request loads
        request.addEventListener("load", function(){
            //check if the request status and state is OK
            if(request.status === 200 && request.readyState === 4){
                //get the response as json data
                let response = JSON.parse(request.responseText);
                
                //the lat/long are returned as a string so convert them to a float
                var latitude = parseFloat(response.latitude);
                var longitude = parseFloat(response.longitude);
                //console.log(latitude);
                //console.log(longitude);

                //set the marker and map to the updated location of the ISS
                marker.setPosition({lat: latitude, lng: longitude});
                map.panTo({lat: latitude, lng: longitude});
            }
        });
    }, 3000);
}