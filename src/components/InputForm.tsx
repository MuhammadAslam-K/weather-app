import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { DataList, ErrorResponse } from "../types/index"
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

export default function InputForm({
  setWeatherData,
  setMessage,
  URL,
  API_KEY,
}: {
  setWeatherData: Dispatch<SetStateAction<DataList[] | null>>;
  setMessage: Dispatch<SetStateAction<string>>;
  URL: string;
  API_KEY: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const getWeatherData = async (event: React.FormEvent) => {
    event.preventDefault();

    const city = inputRef?.current?.value;

    if (!city) return;

    try {
      toast.loading("Loading...");

      const { data } = await axios.get(
        `${URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      console.log("🚀 ~ file: InputForm.tsx:24 ~ getWeatherData ~ data:", data);
      setWeatherData({ ...data.list[1], city: data.city.name });

      setMessage("");
      toast.dismiss();

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

  return (
    <form
      className="mx-auto mt-6 h-fit flex justify-center"
      onSubmit={getWeatherData}
    >
      <input
        type="text"
        ref={inputRef}
        className="cityInput p-3 ml:w-96 w-72 rounded-full bg-[rgba(0,0,0,0.5)] text-white text-center text-2xl outline-none"
        placeholder="Enter your city name"
        min="0"
        max="100"
      />
    </form>
  );
}
