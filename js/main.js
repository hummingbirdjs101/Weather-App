document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '65121b52e87e0a967250f7e018b9f2be';

    const citySelect = document.getElementById('city-select');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherInfo = document.getElementById('weather-info');
    const cityImage = document.getElementById('city-image');

    // Fetch and parse CSV file
    fetch('city_coordinates.csv')
        .then(response => response.text())
        .then(csvData => {
            const rows = csvData.split('\n');
            rows.shift(); // Remove header row
            rows.forEach(row => {
                const [latitude, longitude, city, country] = row.split(',');
                const option = document.createElement('option');
                option.value = `${latitude},${longitude}`;
                option.textContent = `${city}, ${country}`;
                citySelect.appendChild(option);
            });

            // Fetch weather for the default city (first option)
            if (citySelect.options.length > 0) {
                const [latitude, longitude] = citySelect.options[0].value.split(',');
                fetchWeather(latitude, longitude);
            }
        })
        .catch(error => console.error('Error fetching CSV file:', error));

    citySelect.addEventListener('change', function() {
        const [latitude, longitude] = this.value.split(',');
        fetchWeather(latitude, longitude);
        displayCityImage(this.selectedIndex - 1); // Index offset by 1 due to default option
    });

    function fetchWeather(latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const weatherDescription = data.weather[0].description;
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed;

                // Update weather icon based on weather description
                const icon = getWeatherIcon(weatherDescription);

                const weatherString = `
                    <img src="${icon}" alt="Weather Icon" />
                    <p>Weather: ${weatherDescription}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                `;
                weatherIcon.innerHTML = weatherString;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherIcon.innerHTML = 'Failed to fetch weather data. Please try again later.';
            });
    }

    // Function to get weather icon based on weather description
    function getWeatherIcon(description) {
        // Example logic, replace with your own
        if (description.includes('cloud')) {
            return 'images/cloudy.png';
        } else if (description.includes('sun') || description.includes('clear')) {
            return 'images/clear.png';
        } else if (description.includes('rain')) {
            return 'images/rain.png';
        } else {
            return 'images/mcloudy.png';
        }
    }

    // Function to display city image
    function displayCityImage(index) {
        const cities = ['amsterdam.jpg', 'ankara.jpg', 'astorp.jpg', 'athens.jpg', 'belfast.jpg', 'barcelona.jpg']; // Adjust as needed
        if (index >= 0 && index < cities.length) {
            const imageUrl = `images/${cities[index]}`;
            cityImage.src = imageUrl;
            cityImage.alt = 'City Image';
        }
        console.log(index)
        console.log(imageUrl)
    }
});
