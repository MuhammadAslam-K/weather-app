import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import InputForm from "../components/InputForm";
import WeatherCard from "../components/WeatherCard";
import toast from "react-hot-toast";
import { DataList, ErrorResponse } from "../types";





export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<DataList | null>(null);
  const [message, setMessage] = useState("Search for a city to get started");

  const URL = `https://api.openweathermap.org/data/2.5`;
  const API_KEY = import.meta.env.VITE_API_KEY

  useEffect(() => {
    const fetchWeatherData = async () => {

      try {

        const success = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        console.log("🚀WeatherPage.tsx:12 navigator.geolocation.getCurrentPosition ~ success:", success);
        const { latitude, longitude } = success.coords;
        console.log(latitude, longitude)

        const { data } = await axios.get(
          `${URL}/forecast?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
        );

        console.log("data on first load ", data);
        setWeatherData({ ...data.list[1], city: data.city.name });
        setMessage('');

      } catch (error) {

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;

          if (axiosError.response?.data) {
            toast.error(axiosError.response.data.error);
          } else {
            toast.error('Failed to get weather data.');
          }

        }
      }
    };

    fetchWeatherData();
  }, []);



  const textCenter =
    "textShadow text-white flex justify-center items-center h-5/6";
  return (
    <main className="mx-auto w-full">
      <InputForm
        setMessage={setMessage}
        setWeatherData={setWeatherData}
        URL={URL}
        API_KEY={API_KEY}
      />

      {message && <div className={textCenter}>{message}</div>}

      {weatherData && (
        <div className="flex justify-center gap-8 m-10">
          {<WeatherCard data={weatherData} />}
        </div>
      )}
    </main>
  );
}
