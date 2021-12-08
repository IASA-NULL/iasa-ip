<script>
    import '../../../common/preload'
    import Button, {Label, Group} from '@smui/button'
    import Switch from '@smui/switch';
    import Dialog, {Actions} from '@smui/dialog';
    import Radio from '@smui/radio';
    import FormField from '@smui/form-field';
    import {CenterContainer} from '../../../common/container'
    import {PAGE} from '../../../../const'

    export let moveToPage, developing

    let autoChange, autoVpn, dialogOpen = false, useBeta;

    (async () => {
        autoChange = await window.electron.get('autoChange')
        autoVpn = await window.electron.get('autoVpn')
        useBeta = await window.electron.get('useBeta')
    })()

    $: (async () => {
        try {
            if (autoChange !== undefined) await window.electron.set('autoChange', autoChange)
            if (autoVpn !== undefined) await window.electron.set('autoVpn', autoVpn)
            if (typeof useBeta == "boolean") window.electron.setUpdateChannel(useBeta)
        } catch (e) {

        }
    })()
</script>

<style>
    h2 {
        margin: 5px;
    }
</style>

<CenterContainer>
    <div>
        <h2>IP 자동변경</h2>
        <FormField>
            <Switch icons={false} bind:checked={autoChange}/>
        </FormField>
    </div>
    <div>
        <h2>VPN 자동 연결</h2>
        <FormField>
            <Switch icons={false} bind:checked={autoVpn} on:click={()=>{
                setTimeout(()=>{autoVpn=false
                developing.open()}, 100)
            }}/>
        </FormField>
    </div>
    <Group>
        <Button on:click={()=>{
            window.electron.openIdChangeWindow()
        }}>
            <Label>학번 변경</Label>
        </Button>
        <Button on:click={() => (dialogOpen = true)}>
            <Label>업데이트 설정</Label>
        </Button>
        <Button on:click={moveToPage(PAGE.main.main)}>
            <Label>닫기</Label>
        </Button>
    </Group>
    <Dialog bind:open={dialogOpen}>
        <h2 style="margin: 10px;">업데이트 채널 설정</h2>
        <FormField>
            <Radio bind:group={useBeta} value={false}/>
            <span slot="label">정식 버전</span>
        </FormField>
        <FormField>
            <Radio bind:group={useBeta} value={true}/>
            <span slot="label">베타</span>
        </FormField>
        <Actions>
            <Button on:click={() => (dialogOpen = false)}>
                <Label>닫기</Label>
            </Button>
        </Actions>
    </Dialog>
</CenterContainer>
