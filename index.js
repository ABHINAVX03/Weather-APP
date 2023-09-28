document.addEventListener("DOMContentLoaded", function () {
  //some elements
  const value = document.getElementById("value");
  const x = document.getElementById("info");
  const area = document.getElementById("location_name");
  const date = document.getElementById("date");
  const text = document.getElementById("text");
  const checktemp = document.getElementById("check");
  const img = document.getElementById("logo");

  const icon1 = document.getElementById("img1");
  const icon2 = document.getElementById("img2");
  const icon3 = document.getElementById("img3");

  const temp = document.getElementById("temp");
  const wind = document.getElementById("windspeed");
  const humidity = document.getElementById("humidity");

  //get the live location
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  async function setLocation(position) {
    let val = (value.value =
      (await position.coords.latitude) + "," + position.coords.longitude);
    if (val != null || val != " ") {
      request(val);
    }
  }

  //error handling
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }

  getLocation();
  //api request using AJAX - XMLHttpRequest
  const request = (v) => {
    const apiKey = "732975e0faff4e39922143726232608";
    const loc = v;

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=1&alerts=yes`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        //rendering data
        area.innerText = `${data.location.name} - ${data.location.region} | ${data.location.country}`;
        img.src = data.current.condition.icon;
        text.innerText = data.current.condition.text;

        if (data.current.temp_c > 35 || data.current.temp_f > 95) {
          icon1.className = "fas fa-temperature-high";
        } else {
          icon1.className = "fas fa-temperature-low";
        }
        temp.innerText = `${data.current.temp_c}${'\u00B0'}C`;
        const updateTemprature=() => {
          const isFahrenheit = checktemp.checked;

          if (isFahrenheit) {
            temp.innerText = `${data.current.temp_f}${"\u00B0"}F`;
          } else {
            temp.innerText = `${data.current.temp_c}${"\u00B0"}C`;
          }
        };
        checktemp.addEventListener('change',updateTemprature)
        updateTemprature()
        icon2.className = "fas fa-droplet";
        humidity.innerText = data.current.humidity;
        icon3.className = "fas fa-wind";
        wind.innerText = `${data.current.wind_kph}kph`;
        const d = new Date();
        date.innerText = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
      } else {
        console.error("Enter the valid Location...");
      }
    };

    xhr.onerror = function () {
      x.innerText = "Network error occurred :: 404";
    };

    xhr.send();
  };

  //adding event to trigger the search method
  document.addEventListener("click", search);

  function search() {
    document.getElementById("search");
    request(value.value);
  }

  
});
