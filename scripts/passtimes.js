window.addEventListener('load', () => {
    const form = document.forms[0];
    const results = document.getElementById("results");

    results.style.display = "none";

    form.onsubmit = function validate(){
        const lat = form["lat"].value;
        const long = form["long"].value;
        const dropdown = document.getElementById("passtimes");
        const passtimes = dropdown.options[dropdown.selectedIndex].value;
        let latValid = longValid = true;

        if(isNaN(lat) || lat < -90 || lat > 90){
            let lat = document.getElementById('lat');
            lat.style.border = '2px solid red';

            let err = document.getElementById('laterror');
            err.innerHTML = "* Enter a valid latitude (-90 - 90)."

            latValid = false;
        }

        if(isNaN(long) || long < -180 || long > 180){
            let long = document.getElementById('long');
            long.style.border = '2px solid red';

            let err = document.getElementById('longerror');
            err.innerHTML = "* Enter a valid longitude (-180 - 180)."

            longValid = false;
        }
        
        if(latValid && longValid){
            results.style.display = "block";

            const PASSTIMES_URL = `https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${long}&n=${passtimes}`;

            //make a new request
            const request = new XMLHttpRequest();

            //send a request to the api url
            request.open("GET", PASSTIMES_URL);
            request.send();

            //add an event listener for when the request loads
            request.addEventListener("load", function(){
                //check if the request status and state is OK
                if(request.status === 200 && request.readyState === 4){
                    //get the response as json data
                    let response = JSON.parse(request.responseText);
                    
                    document.getElementById("results__lat").textContent = lat;
                    document.getElementById("results__long").textContent = long;

                    //get json data and display it in the html elements
                    const res = response.response;

                    const results = document.getElementById("results__passes");

                    let text = "";

                    res.forEach(pass => {
                        text += `<li>${getTime(pass.risetime)} on ${getDate(pass.risetime)} for ${secondsToMins(pass.duration)}</li>`;
                    });

                    results.innerHTML = text;
                }
            });

            return false;
        } else{
            return false;
        }
    }
});

function getTime(unix){
    //multiply time by 1000 to convert to milliseconds because its unix time so it's in seconds
    const date = new Date(unix * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let meridiem = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;

    return `${hours}:${minutes} ${meridiem}`;
}
function getDate(unix){
    const date = new Date(unix * 1000); //date is returned in unixtime so multiply it by 1000
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return `${months[date.getMonth()]} ${date.getDate()}`;
}
function secondsToMins(duration){
    const minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60;

    return `${minutes} minutes and ${seconds} seconds`;
}