<script lang="ts">
	import type { Character } from '$types';
	import Icon from '@iconify/svelte';
	import XIcon from '@iconify-icons/mdi/multiply';

	export let character: Character;
</script>

<a
	href="/characters/{character.id}"
	class="rarity relative cursor-pointer {character.rarity === "ssr"
		? 'rarity-ssr'
		: 'rarity-sr'}"
>
	<div class="background" ></div>
	<img
		src={`/images/characters/${character.id}.png`}
		alt={character.name}
		class="relative h-auto w-28 md:w-32"
		width={374}
		height={512}
	/>
	<span
		class="absolute bottom-1 left-0 right-0 text-center text-lg font-semibold leading-none text-white"
		>{character.name}</span
	>
	{#if character.id !== 'trailblazer'}
		<img
			src="/images/elements/{character.element}.png"
			alt={character.element}
			class="absolute left-1 top-1 h-6 w-6"
		/>
		<img
			src="/images/bursts/{character.burst}.png"
			alt=burst-{character.burst}
			class="absolute left-1 top-9 h-6 w-6 rounded-full bg-black/20"
		/>
	{/if}
</a>

<style lang="postcss">
	.background {
		content: '';
		@apply absolute bottom-0 left-0 right-0 top-0 duration-150;
	}

	.rarity:hover > .background {
		opacity: 50%;
	}

	.rarity-ssr > .background {
		background: linear-gradient(
			to top,
			transparent 0%,
			theme(colors.ssr) 30%,
			theme(colors.ssr) 40%,
			transparent 80%
		);
		opacity: 30%;
	}

	.rarity-sr > .background {
		background: linear-gradient(
			to top,
			transparent 0%,
			theme(colors.sr) 30%,
			theme(colors.sr) 40%,
			transparent 80%
		);
		opacity: 30%;
	}
</style>