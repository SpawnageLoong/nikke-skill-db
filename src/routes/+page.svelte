<script lang="ts">
	import CharacterCard from './CharacterCard.svelte';
	import Title from '$components/Title.svelte';
	import charactersJson from '$data/characters.json';
	import elementsJson from '$data/elements.json';
	import weaponsJson from '$data/weapons.json';
	import { onMount } from 'svelte';
	import type { Character } from '$types';

	type CharacterJson = { [key: string]: Character };

	// Import character data from JSON as an array of objects with Character type
	const characters: Character[] = Object.values(charactersJson as CharacterJson);

	// Import elements and weapons data from JSON
	const elements = Object.values(elementsJson);
	const weapons = Object.values(weaponsJson);

	const defaultFilters = {
		elements: Object.fromEntries(elements.map((element) => [element.id, true])),
		weapons: Object.fromEntries(weapons.map((weapon) => [weapon.id, true])),
	};

	// Create reactive states for the tags, elements and weapons lists
	let all_tags = $state(new Array<string>)
	let all_elements = $state(new Array<string>);
	let all_weapons = $state(new Array<string>);

	// Create reactive state for the weapon and element filters and tags list
	let filter = $state(defaultFilters);
	let tags = $state(new Array<string>);

	// Create reactive state for the filtered character list
	let list = $state(new Array<Character>);

	// Function to populate the reactive states with the tags, elements and weapons lists
	function initLists() {
		for (const character of characters) {
			for (const tag of character.tags) {
				if (!all_tags.includes(tag)) {
					all_tags.push(tag);
				}
			}
			if (!all_elements.includes(character.element)) {
				all_elements.push(character.element);
			}
			if (!all_weapons.includes(character.weapon)) {
				all_weapons.push(character.weapon);
			}
		}
		list = characters;
	}

	// Reactive effect to filter the character list based on the selected filters
	$effect(() => {
		list = characters.filter((character) => {
			const element = filter.elements[character.element];
			const weapon = filter.weapons[character.weapon];
			const tag = tags.every((tag) => character.tags.includes(tag));
			return element && weapon && tag;
		});
	})

	function toggleFilter(type: 'elements' | 'weapons', id: string) {
		const current = Object.values(filter[type]);
		const trueCount = current.filter((e) => e).length;

		filter[type][id] = !filter[type][id];

		if (trueCount === current.length) {
			for (const key in filter[type]) {
				filter[type][key] = false || key === id;
			}
		} else if (trueCount === 1 && !filter[type][id]) {
			for (const key in filter[type]) {
				filter[type][key] = true;
			}
		}
	}

	onMount(() => {
		initLists();
	});
</script>

<svelte:head>
	<title>Characters | Nikke Skill DB</title>
</svelte:head>

<Title>Characters</Title>
<div class="mb-4 flex flex-col gap-8 md:flex-row">
	<div class="flex justify-center gap-2 md:justify-normal">
		{#each elements as element}
			<button
				class="duration-150 hover:opacity-80 {filter.elements[element.id] ? '' : 'opacity-30'}"
				onclick={() => toggleFilter('elements', element.id)}
			>
				<img
					class="inline-block h-8 w-8"
					width={32}
					height={32}
					src="/images/elements/{element.id}.png"
					alt={element.name}
				/>
			</button>
		{/each}
	</div>
	<div class="flex flex-wrap justify-center gap-2 md:justify-normal">
		{#each weapons as weapon}
			<button
				class="duration-150 hover:opacity-80 {filter.weapons[weapon.id] ? '' : 'opacity-30'}"
				onclick={() => toggleFilter('weapons', weapon.id)}
			>
				<img
					class="inline-block h-8 w-12"
					width={40}
					height={25}
					src="/images/weapons/{weapon.id}.png"
					alt={weapon.name}
				/>
				<span class="inline-block pl-0.5 text-sm leading-none text-white/80">{weapon.id.toUpperCase()}</span>
			</button>
		{/each}
	</div>
</div>
<div class="flex flex-wrap justify-center gap-2 md:justify-normal">
	{#each all_tags as tag}
		<button
			class="duration-150 hover:opacity-80 {tags.includes(tag) ? '' : 'opacity-30'}"
			onclick={() => tags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]}
		>
			<span class="text-sm leading-none text-white/80">{tag}</span>
		</button>
	{/each}
</div>
<div class="flex flex-wrap justify-center gap-2 md:justify-normal md:gap-3">
	{#each list as character (character.id)}
		<CharacterCard {character} />
	{/each}
</div>