import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import months from "./months";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WeatherCard from "./WeatherCard";
import { degreeToCompass, getDayOfWeek, getFlagEmoji } from "./utils";

export default class CityWeatherDetails extends React.Component {
  state = {
    details: null,
    forecast: [],
    isForecastLoading: true,
  };

  componentDidMount() {
    const { city } = this.props.route.params;
    this.getForecast(city);
  }

  getForecast(city) {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=fda2d6e8161f388b0b98556125929820`
    )
      .then((response) => response.json())
      .then((results) => {
        let result = results[0];
        let { lat, lon } = result;

        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=fda2d6e8161f388b0b98556125929820&units=metric`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((forecast) => {
            let count = 0;
            for (let fc of forecast.daily) fc.key = `Forecast #${++count}`;
            this.setState({
              forecast: forecast.daily,
              isForecastLoading: false,
            });
          })
          .catch((err) => alert(err));
      })
      .catch((err) => alert(err));
  }

  render() {
    let { country, city, details } = this.props.route.params;
    let { isForecastLoading, forecast } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleText}>
            {getDayOfWeek()}, {new Date().getDate()}{" "}
            {months[new Date().getMonth()]} {new Date().getFullYear()}
          </Text>
          <Text style={styles.subtitleText}>
            {getFlagEmoji(country)} {city}
          </Text>
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                paddingLeft: 30,
              }}
            >
              <View style={[styles.container, styles.verticalCenter]}>
                <FontAwesome
                  name="tachometer"
                  size={30}
                  color="orange"
                  style={{ paddingRight: 12, paddingLeft: 7 }}
                />
                <Text>{details.main.pressure}hPa</Text>
              </View>
              <View style={[styles.container, styles.verticalCenter]}>
                <MaterialCommunityIcons
                  name="water-percent"
                  size={45}
                  color="orange"
                  style={{ paddingRight: 5 }}
                />
                <Text>{details.main.humidity}%</Text>
              </View>
              <View style={[styles.container, styles.verticalCenter]}>
                <MaterialCommunityIcons
                  name="wind-turbine"
                  size={40}
                  color="orange"
                  style={{ paddingLeft: 2, paddingRight: 7 }}
                />
                <Text>
                  {details.wind.speed}m/s {degreeToCompass(details.wind.deg)}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.verticalCenter,
                {
                  flex: 1,
                },
              ]}
            >
              <View
                style={[
                  styles.container,
                  styles.verticalCenter,
                  { marginBottom: 10 },
                ]}
              >
                <Image
                  style={[styles.weatherIcon, { marginRight: -10 }]}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${details.weather[0].icon}@2x.png`,
                  }}
                />
                <View>
                  <Text style={styles.currentTemp}>
                    {parseInt(details.main.temp)}ºC
                  </Text>
                  <Text>
                    {details.weather[0].description[0].toUpperCase() +
                      details.weather[0].description.substring(
                        1,
                        details.weather[0].description.length
                      )}
                  </Text>
                </View>
              </View>
              <View style={[styles.container, styles.verticalCenter]}>
                <FontAwesome5
                  name="temperature-low"
                  size={24}
                  color="orange"
                  style={{ paddingRight: 20 }}
                />
                <Text>{parseInt(details.main.temp_min)}ºC</Text>
              </View>
              <View style={[styles.container, styles.verticalCenter]}>
                <FontAwesome5
                  name="temperature-high"
                  size={24}
                  color="orange"
                  style={{ paddingRight: 20 }}
                />
                <Text>{parseInt(details.main.temp_max)}ºC</Text>
              </View>
            </View>
          </View>
          {isForecastLoading ? (
            <View style={styles.bottomLoading}>
              <ActivityIndicator
                size="large"
                color="orange"
                style={{ transform: [{ scale: 2 }] }}
              />
            </View>
          ) : (
            <View style={{ position: "absolute", bottom: 0 }}>
              <FlatList
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                contentContainerStyle={{ padding: 10 }}
                data={forecast}
                renderItem={({ item }) => (
                  <WeatherCard key={item.key} details={item} />
                )}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 25,
    paddingLeft: 30,
    paddingTop: 30,
  },
  subtitleText: {
    fontSize: 15,
    paddingBottom: 30,
    paddingLeft: 30,
  },
  container: {
    flexDirection: "row",
  },
  verticalCenter: {
    alignItems: "center",
  },
  weatherIcon: {
    width: 100,
    height: 50,
  },
  currentTemp: {
    fontWeight: "bold",
    fontSize: 20,
  },
  bottomLoading: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
});
