<script lang="ts">
    import {PAGE} from '../../../const'

    export let fadeout = false, targetPage: PAGE, currentPage: PAGE, height: number
</script>

<style>
    main {
        animation: fadein .3s cubic-bezier(0, .2, .2, 1) forwards;
        opacity: 0;
        height: var(--container-height);
        margin-top: 10px;
    }

    main.fadeout {
        animation: fadeout .2s cubic-bezier(.2, 0, 1, .8) forwards;
    }

    @keyframes fadein {
        0% {
            margin-top: 20px;
            opacity: 0;
        }
        100% {
            margin-top: 10px;
            opacity: 1;
        }
    }

    @keyframes fadeout {
        0% {
            margin-top: 10px;
            opacity: 1;
        }
        100% {
            margin-top: 0;
            opacity: 0;
        }
    }
</style>


{#if currentPage === targetPage}
    <main class:fadeout={fadeout} style="--container-height:{height}px">
        <slot/>
    </main>
{/if}