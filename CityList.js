import * as React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import * as Location from "expo-location";
import cities from "./cities.js";
import { getFlagEmoji } from "./utils.js";

export default class CountryList extends React.Component {
  state = {
    location: null,
    currentWeatherData: {},
    isLoading: true,
  };

  openCityWeatherDetails(city, country) {
    this.props.navigation.navigate("City Weather Details", {
      city: city,
      country: country,
      details: this.state.currentWeatherData[city],
    });
  }

  getCurrentLocation(callback) {
    Location.installWebGeolocationPolyfill();
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let location = position.coords;
        const { latitude, longitude } = location;
        await fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=fda2d6e8161f388b0b98556125929820`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then(async (json) => {
            this.setState({
              location: {
                longitude,
                latitude,
                name: json[0].name,
                country: json[0].country,
              },
            });
          })
          .catch((err) => alert(err));
        await callback();
        this.setState({ isLoading: false });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  getCurrentWeatherData = async () => {
    let currentWeatherData = {};
    let citiesWithCurrent = [...cities];
    citiesWithCurrent.push({ key: this.state.location.name });
    for (let city of citiesWithCurrent) {
      await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city.key}&appid=fda2d6e8161f388b0b98556125929820&units=metric`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((details) => {
          currentWeatherData[city.key] = details;
        })
        .catch((err) => alert(err));
    }
    this.setState({ currentWeatherData });
  };

  async componentDidMount() {
    this.getCurrentLocation(this.getCurrentWeatherData);
  }

  render() {
    let { location, isLoading, currentWeatherData } = this.state;
    return isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="orange"
          style={{ transform: [{ scale: 2 }] }}
        />
      </View>
    ) : (
      <FlatList
        data={[
          {
            key: location ? location.name : "Your location",
            country: location ? location.country : "",
          },
          ...cities,
        ]}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.box, { margin: 5, padding: 10 }]}
            onPress={() => {
              this.openCityWeatherDetails(item.key, item.country);
            }}
          >
            <View style={styles.rowContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cityParagraph}>
                  {getFlagEmoji(item.country)}
                  {"   "}
                  {item.key}
                </Text>
              </View>
              <View style={styles.rowRightAlign}>
                <View style={styles.rowRightContainer}>
                  <View style={styles.sideBySideCenter}>
                    <Text style={{ fontWeight: "bold" }}>
                      {parseInt(currentWeatherData[item.key].main.temp)} ºC
                    </Text>
                    <Image
                      style={styles.weatherIcon}
                      source={{
                        uri: `http://openweathermap.org/img/wn/${
                          currentWeatherData[item.key].weather[0].icon
                        }@2x.png`,
                      }}
                    />
                  </View>
                  <Text>
                    {currentWeatherData[
                      item.key
                    ].weather[0].description[0].toUpperCase() +
                      currentWeatherData[
                        item.key
                      ].weather[0].description.substring(
                        1,
                        currentWeatherData[item.key].weather[0].description
                          .length
                      )}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  box: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "white",
  },
  rowContainer: { flexDirection: "row", alignItems: "center" },
  cityParagraph: { fontWeight: "bold", fontSize: 16 },
  rowRightAlign: { flex: 1, alignItems: "flex-end" },
  rowRightContainer: { alignItems: "center", minWidth: 100 },
  sideBySideCenter: { flexDirection: "row", alignItems: "center" },
  weatherIcon: { width: 50, height: 50 },
});
