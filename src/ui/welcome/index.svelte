<script lang="ts">
    import Button, {Label} from '@smui/button'
    import Textfield from '@smui/textfield';
    import {PAGE} from '../../const'
    import {version} from '../../../package.json'


    let currentPage: PAGE = PAGE.welcome.main, fadeout = '', userIdInput
    let changedNotify, showAutomaticChangeEnable = false, developing

    function moveToPage(page: PAGE, cb: any) {
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

    let userId = '', a, b, c, invalid = false;

    $: (async () => {
        if (!userId) invalid = true;
        else if (userId.length !== String(parseInt(userId)).length) invalid = true;
        else if (userId.length < 4) invalid = true;
        else if (userId.length > 5) invalid = true;
        else {
            if (userId.length === 4) {
                a = Math.floor(parseInt(userId) / 1000);
                b = Math.floor(parseInt(userId) / 100 % 10);
                c = parseInt(userId) % 100;
            }
            if (userId.length === 5) {
                a = Math.floor(parseInt(userId) / 10000);
                b = Math.floor(parseInt(userId) / 100 % 10);
                c = parseInt(userId) % 100;
            }
            if (a > 3 || a < 1) invalid = true;
            else if (b > 5 || b < 1) invalid = true;
            else if (c > 16 || c < 1) invalid = true;
            else {
                await window.electron.set('userId', userId)
                await window.electron.set('firstRun', false)
                await window.electron.set('lastVer', version)
                invalid = false
            }
        }
    })()
</script>

<style>
    .wrapper {
        width: 100%;
        height: 100vh;
    }

    .centerContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .centerContainer * {
        margin: 10px;
    }

    main {
        animation: fadein .3s cubic-bezier(0, .2, .2, 1) forwards;
        opacity: 0;
        margin-top: 10px;
        height: 470px;
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

<div class="wrapper">
    {#if currentPage === PAGE.welcome.main}
        <main class="{fadeout}">
            <div class="centerContainer">
                <img src="../../../res/logo.png" width="70">
                <h1>IP의 최초 실행을 위해 몇 가지 설정이 필요해요.</h1>
                <div>
                    <Button on:click={uidInput}>
                        <Label>다음</Label>
                    </Button>
                </div>
            </div>
        </main>
    {/if}
    {#if currentPage === PAGE.welcome.id}
        <main class="{fadeout}">
            <div class="centerContainer">
                <h1>학번을 입력해주세요.</h1>
                <div>
                    <Textfield bind:this={userIdInput} bind:value={userId} type="text" label="학번" invalid={invalid}
                               on:keydown={(e)=>{
                        if(e.key==='Enter')moveToPage(PAGE.welcome.set)
                    }}/>
                </div>
                <div>
                    <Button on:click={moveToPage(PAGE.welcome.set)}>
                        <Label>다음</Label>
                    </Button>
                </div>
            </div>
        </main>
    {/if}
    {#if currentPage === PAGE.welcome.set}
        <main class="{fadeout}">
            <div class="centerContainer">
                <h1>트레이 아이콘 고정</h1>
                <h3>편한 사용을 위해 트레이 아이콘을 고정하세요.</h3>
                <video src="../../../res/manual.mp4" autoplay="autoplay" muted style="width: 300px;" loop></video>
                <div>
                    <Button on:click={moveToPage(PAGE.welcome.done)}>
                        <Label>다음</Label>
                    </Button>
                </div>
            </div>
        </main>
    {/if}
    {#if currentPage === PAGE.welcome.done}
        <main class="{fadeout}">
            <div class="centerContainer">
                <h1>설정 완료!</h1>
                <h3>트레이 아이콘을 누르면 IP를 열 수 있어요.</h3>
                <div>
                    <Button on:click={()=>{
                        window.close()
                    }}>
                        <Label>닫기</Label>
                    </Button>
                </div>
            </div>
        </main>
    {/if}
</div>
