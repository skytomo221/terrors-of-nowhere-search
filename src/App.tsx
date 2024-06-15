import React from "react";

import data from "./data.json";
import images from './images';

type Terror = {
  name: string;
  links?: Record<string, string>;
};

function search(terrors: Terror[], rawKeyword: string) {
  const sorted = terrors
    .map((terror) => {
      const target = terror.name.toLowerCase();
      const keyword = rawKeyword.toLowerCase();
      if (target === keyword) return { terror, rank: 0 };
      if (target.startsWith(keyword)) return { terror, rank: 1 };
      if (target.endsWith(keyword)) return { terror, rank: 2 };
      if (target.includes(keyword)) return { terror, rank: 3 };
      return { terror, rank: -1 };
    })
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => a.rank - b.rank);
  return sorted.map(({ terror }) => terror);
}

function toSnakeCase(str: string) {
  return str
    .toLocaleLowerCase()
    .replaceAll(/[.[\]’]/g, "")
    .replaceAll(" ", "_")
}

export default function App() {
  const { terrors, wikis } = data;
  const [searchWord, setSearchWord] = React.useState("");
  const [selectedWiki, setSelectedWiki] =
    React.useState<keyof typeof wikis>("ton-jp.wiki");

  const createUrl = (terror: Terror) => {
    if (terror.links && terror.links[selectedWiki]) {
      return terror.links[selectedWiki];
    }
    if (selectedWiki === "terror.moe") {
      return wikis[selectedWiki].terrorsLink.replace(
        "$terror",
        toSnakeCase(terror.name),
      );
    }
    return wikis[selectedWiki].terrorsLink.replace("$terror", terror.name);
  };

  return (
    <div>
      <h1>Terrors of Nowhere Search</h1>
      <div className="search">
        <select
          name="pets"
          id="pet-select"
          onChange={(e) => {
            setSelectedWiki(e.target.value as keyof typeof wikis);
          }}
        >
          {Object.keys(wikis).map((wiki) => (
            <option key={wiki} value={wiki}>
              {wiki}
            </option>
          ))}
        </select>
        <input
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="検索……"
        />
      </div>
      <div className="terror-box">
        {search(terrors, searchWord).map((terror) => (
          <a key={terror.name} href={createUrl(terror)}>
            <img className="terror" src={images[toSnakeCase(terror.name)]} alt={terror.name} />
            <div>{terror.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
