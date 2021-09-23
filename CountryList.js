import * as React from "react";
import { List, TouchableRipple } from "react-native-paper";
import countries from "./country.js";

const CountryList = () => (
  <List.Section>
    {countries.map((x) => (
      <TouchableRipple
        onPress={() => console.log("Pressed")}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <List.Item title={x} left={() => <List.Icon icon="folder" />} />
      </TouchableRipple>
    ))}
  </List.Section>
);

export default CountryList;
