const url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

//make a new request
let request = new XMLHttpRequest();

//send a request to the api url
request.open("GET", url);
request.send();

//add an event listener for when the request loads
request.addEventListener("load", function(){
    //check if the request status and state is OK
    if(request.status === 200 && request.readyState === 4){
        //get the response as json data
        let response = JSON.parse(request.responseText);

        //get json data and display it in the html elements
        document.getElementById("image").src = response.hdurl;
        document.getElementById("title").textContent = response.title;
        document.getElementById("exp").textContent = response.explanation;
    }
});