<script lang="ts">
    import '../common/preload'
    import Button, {Label} from '@smui/button'
    import Textfield from '@smui/textfield';
    import {PAGE} from '../../const'
    import {version} from '../../../package.json'
    import Container, {CenterContainer, Wrapper} from '../common/container'
    import {validateUserId} from "../common/validate";


    let currentPage: PAGE = PAGE.welcome.main, fadeout = '', userIdInput
    let changedNotify, showAutomaticChangeEnable = false, developing

    function moveToPage(page: PAGE, cb?: any) {
        return () => {
            fadeout = 'fadeout'
            setTimeout(() => {
                fadeout = ''
                currentPage = page
                if (cb) cb()
            }, 200)
        }
    }

    function uidInput() {
        moveToPage(PAGE.welcome.id, () => {
            setTimeout(() => {
                userIdInput.focus()
            }, 100)
        })()
    }

    let userId = '', invalid = true;

    $: (async () => {
        if (validateUserId(userId)) {
            await window.electron.set('userId', userId)
            await window.electron.set('firstRun', false)
            await window.electron.set('lastVer', version)
            await window.electron.set('lastIdChanged', new Date().getFullYear())
            invalid = false
        } else invalid = true
    })()
</script>


<Wrapper>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.welcome.main} height={470}>
        <CenterContainer>
            <img src="../../../res/logo.png" width="70" alt="LOGO">
            <h1>IP의 최초 실행을 위해 몇 가지 설정이 필요해요.</h1>
            <div>
                <Button on:click={uidInput}>
                    <Label>다음</Label>
                </Button>
            </div>
        </CenterContainer>
    </Container>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.welcome.id} height={470}>
        <CenterContainer>
            <h1>학번을 입력해주세요.</h1>
            <div>
                <Textfield bind:this={userIdInput} bind:value={userId} type="text" label="학번" invalid={invalid}/>
            </div>
            <div>
                <Button on:click={moveToPage(PAGE.welcome.set)} disabled={invalid}>
                    <Label>다음</Label>
                </Button>
            </div>
        </CenterContainer>
    </Container>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.welcome.set} height={470}>
        <CenterContainer>
            <h1>트레이 아이콘 고정</h1>
            <h3>편한 사용을 위해 트레이 아이콘을 고정하세요.</h3>
            <video src="../../../res/manual.mp4" autoplay="autoplay" muted style="width: 300px;" loop></video>
            <div>
                <Button on:click={moveToPage(PAGE.welcome.done)}>
                    <Label>다음</Label>
                </Button>
            </div>
        </CenterContainer>
    </Container>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.welcome.done} height={470}>
        <CenterContainer>
            <h1>설정 완료!</h1>
            <h3>트레이 아이콘을 누르면 IP를 열 수 있어요.</h3>
            <div>
                <Button on:click={()=>{
                        window.close()
                    }}>
                    <Label>닫기</Label>
                </Button>
            </div>
        </CenterContainer>
    </Container>
</Wrapper>
