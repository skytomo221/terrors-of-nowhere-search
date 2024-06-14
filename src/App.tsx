import React from 'react';

import data from './data.json';

export default function App() {
  const { terrors, wikis } = data;
  const [searchWord, setSearchWord] = React.useState('');
  const [selectedWiki, setSelectedWiki] = React.useState<keyof typeof wikis>('ton-jp.wiki');

  return (
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
      {terrors
        .filter((terror) => terror.name.toLowerCase().startsWith(searchWord.toLowerCase()))
        .map((terror) => (
          <a
            key={terror.name}
            href={
              (terror.links && terror.links[selectedWiki])
              || wikis[selectedWiki].terrorsLink.replace('$terror', terror.name)
            }
          >
            {terror.name}
          </a>
        ))}
    </div>
  );
}
