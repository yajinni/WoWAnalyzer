const MAGIC_SCHOOLS: { 
  names: { [id: number]: string }, 
  ids: { [name: string]: number } 
} = {
  names: {
    1: 'Physical',
    2: 'Holy',
    4: 'Fire',
    8: 'Nature',
    16: 'Frost',
    28: 'Elemental',
    32: 'Shadow',
    33: 'Shadowstrike',
    34: 'Twilight',
    36: 'Shadowflame',
    40: 'Plague',
    48: 'Shadowfrost',
    64: 'Arcane',
    96: 'Spellshadow',
    100: 'Special',
    124: 'Chaos',
  },
  // Multi-school spells are OR'ed together using these base schools
  ids: {
    PHYSICAL: 1,
    HOLY: 2,
    FIRE: 4,
    NATURE: 8,
    FROST: 16,
    SHADOW: 32,
    ARCANE: 64,
  },
};

export default MAGIC_SCHOOLS;
