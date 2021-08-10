<style>
    .centerContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .centerContainer > :global(*) {
        margin: 10px;
    }
</style>

<div class="centerContainer">
    <slot/>
</div>