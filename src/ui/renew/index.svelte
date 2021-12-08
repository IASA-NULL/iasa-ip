<script lang="ts">
    import {onMount} from 'svelte'
    import '../common/preload'
    import Button, {Label} from '@smui/button'
    import Textfield from '@smui/textfield';
    import {PAGE} from '../../const'
    import {version} from '../../../package.json'
    import Container, {CenterContainer, Wrapper} from '../common/container'
    import {validateUserId} from "../common/validate";


    let currentPage: PAGE = PAGE.renew.main, fadeout = false, userIdInput
    let changedNotify, showAutomaticChangeEnable = false, developing

    function moveToPage(page: PAGE, cb?: any) {
        return () => {
            fadeout = true
            setTimeout(() => {
                fadeout = false
                currentPage = page
                if (cb) cb()
            }, 200)
        }
    }

    async function saveInfo() {
        await window.electron.set('userId', userId)
        await window.electron.set('firstRun', false)
        await window.electron.set('lastVer', version)
        await window.electron.set('lastIdChanged', new Date().getFullYear())
    }

    let userId = '', invalid = true;

    $: (async () => {
        if (validateUserId(userId)) {
            await saveInfo()
            invalid = false
        } else invalid = true
    })()

    onMount(async () => {
        userIdInput.focus()
        await window.electron.set('userId', '')
    });
</script>

<Wrapper>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.renew.main} height={470}>
        <CenterContainer>
            <h1>학번을 입력해주세요.</h1>
            <h3>학번은 1년에 한번씩 변경해야 해요.</h3>
            <div>
                <Textfield bind:this={userIdInput} bind:value={userId} type="text" label="학번" invalid={invalid}
                           on:keypress={async e=>{
                    if (e.key === 'Enter') {
                        if (validateUserId(userId)) {
                            await saveInfo()
                            window.close()
                        }
                    }
                }}/>
            </div>
            <div>
                <Button on:click={()=>{window.close()}} disabled={invalid}>
                    <Label>확인</Label>
                </Button>
            </div>
        </CenterContainer>
    </Container>
</Wrapper>
