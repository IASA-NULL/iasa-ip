<script lang="ts">
    import {onMount} from 'svelte'
    import '../common/preload'
    import Button, {Label} from '@smui/button'
    import Textfield from '@smui/textfield';
    import {PAGE} from '../../const'
    import {version} from '../../../package.json'
    import Container, {CenterContainer, Wrapper} from '../common/container'
    import {validateUserId} from "../common/validate";


    let currentPage: PAGE = PAGE.updated.v600, fadeout = false
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

</script>

<Wrapper>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.updated.v600} height={470}>
        <CenterContainer>
            <h1>IP가 업데이트됐어요!</h1>
            <h2>이번 버전에서는 이런 것들이 업데이트됐어요.</h2>
            <br/>
            <div>
                <h3>IP가 완전히 새로워졌어요!</h3>
                <p>IP를 새로운 프레임워크로 다시 짰어요.</p>
                <p>속도도 빨라지고 안정성도 증가했어요!</p>
            </div>
            <div>
                <Button on:click={()=>{window.close()}}>
                    <Label>닫기</Label>
                </Button>
            </div>
        </CenterContainer>
    </Container>
</Wrapper>
