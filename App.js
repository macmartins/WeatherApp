import React from "react";
import { IconButton } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CityList from "./CityList";
import CityWeatherDetails from "./CityWeatherDetails";

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerRight: () => (
              <IconButton
                icon="cog"
                size={20}
                onPress={() => console.log("Settings")}
              />
            ),
            contentStyle: { backgroundColor: "#fffafa" },
          }}
        >
          <Stack.Screen
            name="City Forecast"
            component={CityList}
            options={({ navigation }) => ({
              headerLeft: () => (
                <IconButton
                  icon="menu"
                  size={20}
                  onPress={() => navigation.navigate("City Forecast")}
                />
              ),
              headerTitleAlign: "center",
            })}
          />
          <Stack.Screen
            name="City Weather Details"
            component={CityWeatherDetails}
            options={{
              headerTitleAlign: "center",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
