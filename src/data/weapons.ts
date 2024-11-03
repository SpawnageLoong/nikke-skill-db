import type { Weapon } from '$types';
import defaultJson from './weapons/en.json';
import { writable } from 'svelte/store';

const weapons = writable<Weapon[]>(Object.values(defaultJson));

export default weapons;
