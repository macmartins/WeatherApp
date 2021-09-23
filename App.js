import React from "react";
import { Appbar, Text } from "react-native-paper";
import CountryList from "./CountryList";

export default function App() {
  return (
    <div>
      <Appbar>
        <Appbar.Action
          icon="menu"
          onPress={() => console.log("Pressed archive")}
        />
        <Appbar.Content
          title={<Text style={{ color: "white" }}>Forecasts</Text>}
          style={{ alignItems: "center" }}
        />
        <Appbar.Action
          icon="cog"
          onPress={() => console.log("Pressed label")}
        />
      </Appbar>
      <CountryList />
    </div>
  );
}
