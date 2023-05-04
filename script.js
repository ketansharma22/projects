const yourWeather=document.querySelector("[data-yourWeather]");
const searchWeather=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weatherContainer");
const grantAccess=document.querySelector("[data-grantAccess]");
const searchForm=document.querySelector("[data-searchButton]");
const loadingScreen=document.querySelector("[data-loadingScreen]");
const weatherInfoContainer=document.querySelector("[data-weatherInfo]");


let currentTab=yourWeather;
const API_key="31573e0bf39b0f985394688a05d99af3";
currentTab.classList.add("current-tab");
getfromSessionStorage(); 

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            weatherInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");

        }
        else{
            //m pehle se search wale tab pr tha or ab mughe your weather wale tab pe jana h
            searchForm.classList.remove("active");
            weatherInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

yourWeather.addEventListener("click" , () => {
    switchTab(yourWeather);
});

searchWeather.addEventListener("click", ()=>{
    switchTab(searchWeather);
});

//checks if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    //coordinates nhi present, isliye grant access container wala dikhao
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    //matlab seetha weather-info container dikhao
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//weather nikalne ke liye function bnana h
async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    //API call

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        weatherInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("ok");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityNamee=document.querySelector("[data-cityName]");
    const weatherDescription=document.querySelector("[data-climateInfo]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const weatherImage=document.querySelector("[data-weatherIcon]");
    const temperature=document.querySelector("[data-temperature]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-clouds]");


    //fetching values and rendering them on UI
    cityNamee.innerText= weatherInfo?.name;
    weatherDescription.innerText= weatherInfo?.weather?.[0]?.description;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherImage.src= `https://flagcdn.com/144x108/${weatherInfo?.weather?.[0]?.icon}.png `;
    temperature.innerText= weatherInfo?.main?.temp;
    windspeed.innerText= weatherInfo?.wind?.speed;
    humidity.innerText= weatherInfo?.main?.humidity;
    clouds.innerText= weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessbutton=document.querySelector("[data-grantAccessButton]");
grantAccessbutton.addEventListener("click", getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        return;
    }       
    else{
        fetchSearchWeatherInfo(cityName);
    }

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccess.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`
        );
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userContainer.classList.add("active");
        renderWeatherInfo(data);
        


    }
    catch(err){

    }
};