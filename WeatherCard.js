import React from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import { Card } from "react-native-paper";
import { getDayOfWeek } from "./utils";

export default class WeatherCard extends React.Component {
  render() {
    const { details } = this.props;
    let date = new Date(details.dt * 1000);
    return (
      <Card elevation={10} style={{ minWidth: 150 }}>
        <Card.Content>
          <View style={styles.verticalCenter}>
            <Text style={styles.paragraphTitle}>
              {getDayOfWeek(date).substring(0, 3).toUpperCase()}{" "}
              {date.getDate()}
            </Text>
            <Image
              style={styles.weatherIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${details.weather[0].icon}@2x.png`,
              }}
            />
            <Text>
              {details.weather[0].description[0].toUpperCase() +
                details.weather[0].description.substring(
                  1,
                  details.weather[0].description.length
                )}
            </Text>
            <Text>
              {parseInt(details.temp.max)} / {parseInt(details.temp.min)} ºC
            </Text>
          </View>
        </Card.Content>
      </Card>
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
  columnContainer: {
    flexDirection: "column",
  },
  center: {
    justifyContent: "center",
  },
  verticalCenter: {
    alignItems: "center",
  },
  weatherIcon: {
    width: 75,
    height: 75,
  },
  currentTemp: {
    fontWeight: "bold",
    fontSize: 20,
  },
  paragraphTitle: {
    fontWeight: "bold",
    color: "orange",
  },
});
