import type { Character } from '$types';
import { writable } from 'svelte/store';
import defaulCharacterJson from './characters/en.json';

type CharacterJson = { [key: string]: Character };
const defaultLocale: CharacterJson = defaulCharacterJson;

const characters = writable<Character[]>([]);

function load(json: CharacterJson) {
	const list = Object.values(json).sort((a, b) => a.name.localeCompare(b.name));
	characters.set(list);

	const names = list.reduce((acc: { [key: string]: string }, item) => {
		acc[`character.${item.id}`] = item.name;
		return acc;
	}, {});
}

load(defaultLocale);

export default characters;