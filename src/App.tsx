import React from 'react';

import data from './data.json';

type Terror = {
  name: string;
  links?: Record<string, string>;
};

function search(terrors: Terror[], rawKeyword: string) {
  const sorted = terrors.map((terror) => {
    const target = terror.name.toLowerCase();
    const keyword = rawKeyword.toLowerCase();
    if (target === keyword) return { terror, rank: 0 };
    if (target.startsWith(keyword)) return { terror, rank: 1 };
    if (target.endsWith(keyword)) return { terror, rank: 2 };
    if (target.includes(keyword)) return { terror, rank: 3 };
    return { terror, rank: -1 };
  })
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => a.rank - b.rank)
  return sorted.map(({ terror }) => terror);
}

export default function App() {
  const { terrors, wikis } = data;
  const [searchWord, setSearchWord] = React.useState('');
  const [selectedWiki, setSelectedWiki] = React.useState<keyof typeof wikis>('ton-jp.wiki');

  return (
    <div>
      <div>
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
      {search(terrors, searchWord).map((terror) => (
        <div key={terror.name}>
          <a
            href={
              (terror.links && terror.links[selectedWiki])
              || wikis[selectedWiki].terrorsLink.replace('$terror', terror.name)
            }
          >
            {terror.name}
          </a>
        </div>
      ))}
    </div>
  );
}
