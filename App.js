import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import background from "./assets/background2.jpeg";
import { useCallback, useState } from "react";

import loupe from "./assets/loupe.png";
import { BlurView } from "expo-blur";
import map from "./assets/map.png";
import { fetchWeatherForecast } from "./weather";
import { fetchLocation } from "./weather";
import { debounce } from "lodash";
import house from "./assets/house.png";

import sunny from "./assets/weather/26.png";
import thunder from "./assets/weather/28.png";
import partlyCloudy from "./assets/weather/27.png";
import overcast from "./assets/weather/35.png";
import blowingSnow from "./assets/weather/23.png";
import patchyRain from "./assets/weather/8.png";
import moderateRain from "./assets/weather/7.png";

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  const handleLocation = (location) => {
    fetchWeatherForecast({ cityName: location.name }).then((response) => {
      setWeather(response);
      console.log(response);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocation({ cityName: value }).then((response) => {
        setLocations(response);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const icons = [
    {
      name: "sunny",
      image: sunny,
      code: 1000,
    },
    {
      name: "cloudy",
      image: overcast,
      code: 1006,
    },
    {
      name: "thunder outbreaks",
      image: thunder,
      code: 1087,
    },
    {
      name: "Blowing snow",
      image: blowingSnow,
      code: 227,
    },
    {
      name: "overcast",
      image: overcast,
      code: 1009,
    },
    {
      name: "partly cloudy",
      image: partlyCloudy,
      code: 1003,
    },
    {
      name: "patchy rain possible",
      image: patchyRain,
      code: 1063,
    },
    {
      name: "moderate rain",
      image: moderateRain,
      code: 1189
    }
  ];

  const getIconImage = (code) => {
    const icon = icons.find((i) => i.code === code);
    console.log(code, icon);
    return icon ? icon.image : sunny; // Utilisez une icône par défaut si le code n'est pas trouvé
  };

  return (
    <View className="flex items-center h-screen">
      <Image
        source={background}
        className="absolute h-screen w-full object-cover"
      />

      <View
        className={`${
          showSearch ? "bg-white/10" : "transparent"
        } rounded-full mt-24 pl-10 flex-row items-center justify-end w-[95%]`}
      >
        {showSearch ? (
          <TextInput
            onChangeText={handleTextDebounce}
            placeholder="Search city"
            placeholderTextColor="lightgray"
            className="placeholder-gray-400 text-white text-xl flex-1"
          />
        ) : null}

        <TouchableOpacity
          className="bg-white/30 rounded-full m-1 h-[50px] w-[50px] flex items-center justify-center"
          onPress={() => setShowSearch(!showSearch)}
        >
          <Image source={loupe} className="h-[30px] w-[30px]" />
        </TouchableOpacity>
      </View>

      {locations.length > 0 && showSearch ? (
        <View className="overflow-hidden absolute top-[200px] w-[95%] rounded-3xl bg-white/50 z-50">
          <BlurView intensity={10}>
            {locations.map((location, index) => (
              <TouchableOpacity
                className="flex-row items-center h-[50px] px-5 border-y-gray-300 border-y-[1px]"
                onPress={() => {
                  handleLocation(location), setShowSearch(false);
                }}
                key={index}
              >
                <Image source={map} className="h-[30px] w-[30px]" />
                <Text className="text-black text-xl">
                  {location?.name}, {location?.country}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>
      ) : null}

      <SafeAreaView></SafeAreaView>

      <View className="items-center">
        <Text className="text-white text-[40px]">{locations[0]?.name}</Text>
        <Text className="text-white text-[100px] m-0 font-thin">
          {Math.round(weather?.current?.temp_c)} C°
        </Text>
        <Text className="text-white/50 text-[30px]">
          {weather?.current?.condition.text}
        </Text>
        <Image
          style={{ resizeMode: "contain" }}
          source={getIconImage(weather?.current?.condition?.code)}
          className="h-[210px] w-[260px]"
        />
      </View>

      <ScrollView
        className="bg-black/20 rounded-t-3xl w-full h-[300px] absolute bottom-0 border-t-2 border-white/30"
        horizontal
        styles={styles.shadowProp}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {weather?.forecast?.forecastday?.map((day, index) => (
          <View
            key={index}
            className="flex flex-col items-center justify-center bg-black/30 rounded-full mx-2 h-[200px] px-2 border-[1px] border-white/20"
            style={styles.shadowProp}
          >
            <Text className="text-white text-[30px] capitalize font-thin">
              {new Date(day?.date).getDay() === 0
                ? "Sun"
                : new Date(day?.date).getDay() === 1
                ? "Mon"
                : new Date(day?.date).getDay() === 2
                ? "Tue"
                : new Date(day?.date).getDay() === 3
                ? "Wed"
                : new Date(day?.date).getDay() === 4
                ? "Thu"
                : new Date(day?.date).getDay() === 5
                ? "Fri"
                : new Date(day?.date).getDay() === 6
                ? "Sat"
                : null}
            </Text>
            <Image
              style={{ resizeMode: "contain" }}
              source={getIconImage(day?.day?.condition?.code)}
              className="h-[50px] w-[50px] object-cover"
            />
            <Text className="text-white text-[30px]">
              {Math.round(day?.day.avgtemp_c)}°
            </Text>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
});
