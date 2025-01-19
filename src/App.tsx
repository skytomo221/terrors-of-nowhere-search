import React, { useEffect } from "react";

import data from "./data.json";
import images from "./images";

type Terror = {
  name: string;
  type: string;
  image?: string;
  mystic?: boolean;
  mysticName?: string;
  links?: Record<string, string>;
};

function search(terrors: Terror[], rawKeyword: string) {
  const sorted = terrors
    .map((terror) => {
      const target = terror.name.toLowerCase().replaceAll(/'|’/g, "");
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
    React.useState<keyof typeof wikis>("wikiwiki.jp");
  const [hoveredMysticMoon, setHoveredMysticMoon] = React.useState(false);
  const [twoDigitRandomNumber, setTwoDigitRandomNumber] = React.useState("");
  const [sixDigitRandomNumber, setSixDigitRandomNumber] = React.useState("");
  const [transformationTime, setTransformationTime] = React.useState(0);

  useEffect(() => {
    setInterval(() => {
      if (!hoveredMysticMoon) return;
      setTransformationTime((time) => time + 50 / 1000);
      setTwoDigitRandomNumber(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
      setSixDigitRandomNumber(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
    }, 50);
  }, [hoveredMysticMoon]);

  const createTerrorName = (terror: Terror) => {
    if (hoveredMysticMoon && terror.mystic) {
      const name = (terror.mysticName ?? terror.name).toLocaleUpperCase().replaceAll(" ", "_");
      return (transformationTime % 12 < 2)
        ? sixDigitRandomNumber
        : `${twoDigitRandomNumber}_${name}_${twoDigitRandomNumber}`;
    }
    return terror.name;
  }

  const createUrl = (terror: Terror) => {
    if (terror.links && terror.links[selectedWiki]) {
      return terror.links[selectedWiki];
    }
    if (selectedWiki === "wikiwiki.jp") {
      return wikis[selectedWiki].terrorsLink.replace("$terror", terror.name.replaceAll("’", "'"));
    }
    return wikis[selectedWiki].terrorsLink.replace("$terror", toSnakeCase(terror.name));
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyDown={(e) => {
            const searchResult = search(terrors, searchWord);
            if (searchResult.length > 0 && e.key === "Enter") {
              window.location.href = createUrl(searchResult[0]);
            }
          }}
          placeholder="検索……"
        />
      </div>
      <div className="terror-box">
        {search(terrors, searchWord).map((terror) => (
          <a key={terror.name} href={createUrl(terror)}
            onFocus={() => terror.name === "Mystic Moon" && setHoveredMysticMoon(true)}
            onMouseEnter={() => terror.name === "Mystic Moon" && setHoveredMysticMoon(true)}
            onBlur={() => terror.name === "Mystic Moon" && setHoveredMysticMoon(false)}
            onMouseLeave={() => terror.name === "Mystic Moon" && setHoveredMysticMoon(false)}>
            <img className="terror" src={images[toSnakeCase(terror.image ?? terror.name)]} alt={terror.name} />
            <div>{createTerrorName(terror)}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
