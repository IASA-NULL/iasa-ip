<script>
    import CircularProgress from '@smui/circular-progress'
</script>

<style>
    .centerContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    * {
        color: var(--mdc-theme-on-surface);
    }

    .centerContainer > div {
        text-align: center;
    }
</style>

<div class="centerContainer">
    <div>
        <CircularProgress style="height: 32px; width: 32px;" indeterminate/>
        <h2>잠시만요...</h2>
        <h4 style="margin-bottom: 0;">IP를 바꾸고 있어요.</h4>
    </div>
</div>