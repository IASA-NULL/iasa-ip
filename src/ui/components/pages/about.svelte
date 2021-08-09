<script>
    import Button, {Group, Label} from '@smui/button'
    import {version} from '../../../../package.json'
    import {PAGE} from '../../../const'

    export let moveToPage;
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
</style>

<div class="centerContainer">
    <img src="../../res/logo.png" width="70">
    <h2 style="margin-bottom: 0;">IP {version}</h2>
    <div style="text-align: center">
        <h3>Copyright 2019-2021 SEORII®.</h3>
        <h3>All right reserved.</h3>
    </div>
    <Group>
        <Button on:click={()=>{window.electron.openWebPage('https://github.com/IASA-Null/iasa-ip/')}}>
            <Label>오픈소스</Label>
        </Button>
        <Button on:click={()=>{window.electron.openWebPage('https://seo-rii.github.io')}}>
            <Label>개발자 정보</Label>
        </Button>
        <Button on:click={moveToPage(PAGE.main)}>
            <Label>닫기</Label>
        </Button>
    </Group>
</div>