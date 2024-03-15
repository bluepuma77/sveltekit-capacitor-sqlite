
<script>
    import { onMount } from 'svelte';
    import { insertData, readData } from '$lib/database'

    let data = []
    onMount(async () => {
        data = await readData()
    })

    async function add() {
        await insertData()
        data = await readData()
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>This demo is using <a href="https://capacitorjs.com">CapacitorJS</a> with <a href="https://github.com/capacitor-community/sqlite">sqlite plugin</a>.</p>

<p>Resources:</p>

<ul>
    <li><a href="https://github.com/bersling/svelte-capacitor-recipe">svelte-capacitor-recipe</a></li>
    <li><a href="https://github.com/khromov/sveltekit-capacitor-starter">sveltekit-capacitor-starter</a></li>
    <li><a href="https://github.com/Hugos68/capkit">capkit</a></li>
</ul>

<h3>Data loaded from sqlite</h3>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Text</th>
    </tr>
    {#each data as item}
        <tr>
            <td>{item.id}</td>
            <td>{item.text}</td>
        </tr>
    {/each}
</table>

<button on:click={add}>Add a line</button>