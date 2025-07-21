let cityName = document.querySelector('.cityName');
let tempOutput = document.querySelector('.temprature');
let locName = document.querySelector('.locName');
let date = document.querySelector('.date');
let skyCondition = document.querySelector('.skyCondition');
let weatherLogo = document.querySelector('.logo img');
let dfltContainer = document.querySelector('#defaultContainer');

let cancelIcon = document.querySelector('#cancelIcon');
let defaultIcon = document.querySelector('.defaultIcon');

let feelsLike = document.querySelector('#feelsLike .info');
let aqi = document.querySelector('#aqi .info');
let windSpeed = document.querySelector('#wind .info');
let humidity = document.querySelector('#humidity .info');
let visiblity = document.querySelector('#visiblity .info');
let uv = document.querySelector('#uv .info');



async function getWeatherData(input) {
    if (!input) return;

    const apiKey = '94baed02310d4c03aff112054242310'; // Replace with your WeatherAPI key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${input}&aqi=yes`;


    const response = await fetch(url);
    const data = await response.json();

    return data;
}

function updateData(data) {
    try {

        if (data.error) {
            cityName.innerText = data.error.message;
        } else {

            tempOutput.textContent = `${data.current.temp_c}°C | ${data.current.temp_f}°F`
            cityName.textContent = `${data.location.name}`
            locName.innerHTML = `<img src="assets/loc-Icon.svg" alt="Location"> ${data.location.region}, ${data.location.country}`
            date.innerHTML = `<img src="assets/calender.svg" alt="Date"> ${data.location.localtime}`
            skyCondition.textContent = data.current.condition.text;
            feelsLike.textContent = data.current.feelslike_c;
            windSpeed.textContent = `${data.current.wind_kph} km/h`;
            humidity.textContent = `${data.current.humidity} %`;
            visiblity.textContent = `${data.current.vis_km} km`;
            weatherLogo.setAttribute("src", `${data.current.condition.icon}`);

            let airQuality = data.current.air_quality["us-epa-index"];
            switch (airQuality) {
                case 1:
                    aqi.textContent = "Good";
                    break;
                case 2:
                    aqi.textContent = "Fair";
                    break;
                case 3:
                    aqi.textContent = "Poor";
                    break;
                case 4:
                    aqi.textContent = "Unhealhty";
                    break;
                case 5:
                    aqi.textContent = "Very Unhealthy";
                    break;
                case 6:
                    aqi.textContent = "Hazardius";
                    break;
            }

            let uvIndex = data.current.uv;
            if (uvIndex <= 2) {
                uv.textContent = "Low";

            }
            else if (uvIndex <= 5) {
                uv.textContent = "Moderate";

            }
            else if (uvIndex <= 7) {
                uv.textContent = "High";

            }
            else if (uvIndex <= 10) {
                uv.textContent = "Very high";

            }
            else {
                uv.textContent = "Extreme";
            }
        }
    } catch (error) {
        console.error(error);
        cityName.innerText = "Error fetching data!";
    }

}

async function handleSearch() {
    const data = await getWeatherData();
    updateData(data);
}

areaInput1 = document.querySelector('#areaInput1');
areaInput2 = document.querySelector('#areaInput2');
//input 1
areaInput1.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const city = areaInput1.value.trim();
        if (city) {
            const data = await getWeatherData(city);
            updateData(data);
        }
    }
});

// for input 2
areaInput2.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const city = areaInput2.value.trim();
        if (city) {
            SaveDefaultData(city);
            document.querySelector('.defaultLoc').textContent = `Location: ${city}`

            const data = await getWeatherData(city);
            updateData(data);
            dfltContainer.classList.remove('appear');
        }
    }
});

// for search icon 
async function handleSearch(inputId = 'areaInput1') {
    const input = document.querySelector(`#${inputId}`);
    const city = input.value.trim();
    if (city) {
        if (inputId === 'areaInput2') {
            SaveDefaultData(city);
            dfltContainer.classList.remove('appear');
        }
        const data = await getWeatherData(city);
        updateData(data);
    }
}

defaultIcon.addEventListener("click", () => {
    dfltContainer.classList.add('appear');
});

cancelIcon.addEventListener("click", () => {
    dfltContainer.classList.remove('appear');
});

function SaveDefaultData(areaName) {
    localStorage.setItem("areaName", areaName);
    console.log(areaName + " is seted as Default Location");
}

async function loadDefaultData() {
    const defaultArea = localStorage.getItem("areaName");
    if (defaultArea) {
        areaInput2.value = defaultArea;
        const DATA = await getWeatherData(defaultArea);
        updateData(DATA);
    }

    document.querySelector('.defaultLoc').textContent = `Location: ${defaultArea}`

    let today = new Date();
    let dayName = today.toLocaleString('default', { weekday: 'long' });
    let date = today.getDate();
    let monthName = today.toLocaleString('default', { month: 'long' });
    let year = today.getFullYear();
    document.querySelector('.date').innerHTML = `<img src="assets/calender.svg" alt="Date">${date} ${monthName} ${year}, ${dayName}`;
}

loadDefaultData();