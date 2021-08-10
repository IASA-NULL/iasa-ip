<script>
    import '../../../common/preload'
    import Button, {Label, Group} from '@smui/button'
    import Switch from '@smui/switch';
    import {CenterContainer} from '../../../common/container'
    import {PAGE} from '../../../../const'

    export let moveToPage, developing

    let autoChange, autoVpn

    (async () => {
        autoChange = await window.electron.get('autoChange')
        autoVpn = await window.electron.get('autoVpn')
    })()

    $: (async () => {
        try {
            if (autoChange !== undefined) await window.electron.set('autoChange', autoChange)
            if (autoVpn !== undefined) await window.electron.set('autoVpn', autoVpn)
        } catch (e) {

        }
    })()
</script>

<CenterContainer>
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
    <Group>
        <Button on:click={()=>{
            window.electron.openIdChangeWindow()
        }}>
            <Label>학번 변경</Label>
        </Button>
        <Button on:click={moveToPage(PAGE.main.main)}>
            <Label>닫기</Label>
        </Button>
    </Group>
</CenterContainer>