<script>
    import Button, {Label} from '@smui/button'
    import Switch from '@smui/switch';
    import {PAGE} from '../../../const'

    export let moveToPage, developing

    let autoChange, autoVpn

    (async () => {
        autoChange = await window.electron.get('autoChange')
        autoVpn = await window.electron.get('autoVpn')
    })()

    $: (async () => {
        if (autoChange !== undefined) await window.electron.set('autoChange', autoChange)
        if (autoVpn !== undefined) await window.electron.set('autoVpn', autoVpn)
    })()
</script>

<style>
    .centerContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .centerContainer > div {
        text-align: center;
    }

    * {
        color: var(--mdc-theme-on-surface);
    }
</style>

<div class="centerContainer">
    <div>
        <h2>IP 자동변경</h2>
        <Switch bind:checked={autoChange}/>
    </div>
    <div>
        <h2>VPN 자동 연결</h2>
        <Switch bind:checked={autoVpn} on:click={()=>{
            setTimeout(()=>{autoVpn=false
            developing.open()}, 100)
        }}/>
    </div>
    <Button on:click={moveToPage(PAGE.main)}>
        <Label>닫기</Label>
    </Button>
</div>
