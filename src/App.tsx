import React from "react";

import data from "./data.json";

export function App() {
  const { terrors, wikis } = data;
  const [value, setValue] = React.useState("");
  const [wiki, setWiki] = React.useState<keyof typeof wikis>("ton-jp.wiki");

  return <div>
    <select name="pets" id="pet-select"
      onChange={(e) => { setWiki(e.target.value as keyof typeof wikis) }} >
      {
        Object.keys(wikis).map((wiki) => <option key={wiki} value={wiki}>{wiki}</option>)
      }
    </select>
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="検索……"
    />
    {
      terrors
        .filter((terror) => terror.name.toLowerCase().startsWith(value.toLowerCase()))
        .map((terror) => <a key={terror.name} href={terror.links && terror.links[wiki] || wikis[wiki].terrorsLink.replace("$terror", terror.name)}>{terror.name}</a>)
    }</div>;
}
