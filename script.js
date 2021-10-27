const api = {
    key: "3607350508cd9384391a091e80828102",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

const city = document.querySelector('.city')
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.weather');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high');

window.addEventListener('load', () => {
    //if ("geolocation" in navigator)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('navegador não suporta geolozalicação');
    }
    function setPosition(position) {
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
})

function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

search_button.addEventListener('click', function() {
    searchResults(search_input.value)
})

search_input.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(search_input.value)
    }
}

function searchResults(city) {
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

function displayResults(weather) {
    console.log(weather)

    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `°c`;

    weather_tempo = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_tempo)

    low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(d) {
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days[d.getDay()]; //getDay: 0-6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

container_temp.addEventListener('click', changeTemp)
function changeTemp() {
    temp_number_now = temp_number.innerHTML

    if (temp_unit.innerHTML === "°c") {
        let f = (temp_number_now * 1.8) + 32
        temp_unit.innerHTML = "°f"
        temp_number.innerHTML = Math.round(f)
    }
    else {
        let c = (temp_number_now - 32) / 1.8
        temp_unit.innerHTML = "°c"
        temp_number.innerHTML = Math.round(c)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//qualidade do ar

const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const errorLabel= document.querySelector("label[for='error-msg']")
const componentsEle= document.querySelectorAll(".component-val")

const appId = "5db143697c3673d8d2bb0c1bcb383dd2"
const link = "http://api.openweathermap.org/data/2.5/air_pollution"

const getUserLocation = () => {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
    } else{
        onPositionGatherError({message: "Não foi possivel obter a localização"})
    }
}

const onPositionGathered = pos =>{
    let lat = pos.coords.latitude.toFixed(4),
    lon = pos.coords.longitude.toFixed(4)

    latInp.value = lat
    lonInp.value = lon
    getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) =>{
    const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
        onPositionGatherError(err)
    })
    const airData = await rawData.json()

    console.log(airData)
    setValuesOfAir(airData)
    setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
    const aqi = airData.list[0].main.aqi
    let airStat = "", cor = ""

    airQuality.innerText = aqi

    switch (aqi){
        case 1:
            airStat = "Boa"
            cor: "rgb(19, 201, 28)"
            break
        case 2:
            airStat = "Aceitável"
            cor: "rgb(15, 134, 25)"
            break
        case 3:
            airStat = "Moderado"
            cor: "rgb(201, 204, 13)"
            break
        case 4:
            airStat = "Ruim"
            cor: "rgb(204, 83, 13)"
            break
        case 5:
            airStat = "Muito Ruim"
            cor: "rgb(204, 13, 13)"
            break
        default:
            airStat = "Desconhecida"

    }
    airQualityStat.innerText = airStat
    airQualityStat.style.color = cor
    //airQualityStat.style.color = color
}

setComponentsOfAir = airData => {
    let component = { ...airData.list[0].components }
    componentsEle.forEach(ele =>{
        const attr = ele.getAttribute('data-comp')
        ele.innerText = component[attr] += 'μg/m3'
    })
}

const onPositionGatherError = e => {
    errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
    let lat = parseFloat(latInp.value).toFixed(4)
    let lon = parseFloat(lonInp.value).toFixed(4)
    getAirQuality(lat, lon)
})

getUserLocation()