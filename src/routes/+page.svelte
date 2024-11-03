<script lang="ts">
	import CharacterCard from './CharacterCard.svelte';
	import Title from '$components/Title.svelte';
	import characters from '$data/characters';
	import elements from '$data/elements';
	import weapons from '$data/weapons';
	import { onMount } from 'svelte';

	let list = $characters;
	let filter: { elements: { [key: string]: boolean }; weapons: { [key: string]: boolean } } = {
		elements: {
			...$elements.reduce<{ [key: string]: boolean }>((prev, cur) => {
				prev[cur.id] = true;
				return prev;
			}, {})
		},
		weapons: {
			...$weapons.reduce<{ [key: string]: boolean }>((prev, cur) => {
				prev[cur.id] = true;
				return prev;
			}, {})
		}
	};

	function filterList() {
		list = $characters.filter((character) => {
			return (
				filter.elements[character.element] &&
				filter.weapons[character.weapon]
			);
		});
	}

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

		filterList();
	}

	onMount(() => {
		const unsub = characters.subscribe(() => {
			filterList();
		});

		return () => unsub();
	});
</script>

<svelte:head>
	<title>Characters | Nikke Skill DB</title>
</svelte:head>

<div class="mb-4 flex flex-col gap-8 md:flex-row">
	<div class="flex justify-center gap-2 md:justify-normal">
		{#each $elements as element}
			<button
				class="duration-150 hover:opacity-80 {filter.elements[element.id] ? '' : 'opacity-30'}"
				on:click={() => toggleFilter('elements', element.id)}
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
		{#each $weapons as weapon}
			<button
				class="duration-150 hover:opacity-80 {filter.weapons[weapon.id] ? '' : 'opacity-30'}"
				on:click={() => toggleFilter('weapons', weapon.id)}
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
<div class="flex flex-wrap justify-center gap-2 md:justify-normal md:gap-3">
	{#each list as character (character.id)}
		<CharacterCard {character} />
	{/each}
</div>