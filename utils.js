import daysOfWeek from "./dayOfWeek";

export function degreeToCompass(num) {
  let value = Math.floor(num / 22.5 + 0.5);
  let arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[value % 16];
}

export function getDayOfWeek(date) {
  var d;
  if (!date) d = new Date();
  else d = date;
  return daysOfWeek[d.getDay()];
}

export function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
