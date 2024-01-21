import axios from 'axios';

export const API_KEY = "72aad1dbc2394289942142306232212"
const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=7&aqi=no&alerts=n`;
const locationEndpoint = (params) =>
    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;


const apiCall = async (params) => {
    const options = {
        method: 'GET',
        url: params,
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return {};
    }
}

export const fetchWeatherForecast = params=> {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocation = params => {
    return apiCall(locationEndpoint(params));
}
