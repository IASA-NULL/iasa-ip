<script lang="ts">
    import '../common/preload'
    import Container from '../common/container'
    import List, {
        Item,
        Graphic,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list'
    import Window from './components/window.svelte'
    import Snackbar, {Actions, Label} from '@smui/snackbar';
    import IconButton from '@smui/icon-button';
    import {version} from '../../../package.json'
    import {PAGE, PLACE, getPlaceName, getAnotherPlace} from '../../const'
    import {getImagePath} from "../common/resources";

    import About from './components/pages/about.svelte'
    import Setting from './components/pages/setting.svelte'
    import Loading from './components/pages/loading.svelte'

    let currentPlace = PLACE.unknown, currentPage: PAGE = PAGE.main.main, fadeout = ''
    let changedNotify, errorNotify, showAutomaticChangeEnable = false, developing

    function moveToPage(page: PAGE) {
        return () => {
            fadeout = 'fadeout'
            setTimeout(() => {
                fadeout = ''
                currentPage = page
            }, 200)
        }
    }

    function changePlace() {
        moveToPage(PAGE.main.loading)()
        let targetPlace = getAnotherPlace(currentPlace)
        window.electron.changeToPlace(targetPlace).then((res) => {
            if (res) {
                currentPlace = targetPlace
                moveToPage(PAGE.main.main)()
                changedNotify.open()
                showAutomaticChangeEnable = true
            } else {
                moveToPage(PAGE.main.main)()
                errorNotify.open()
            }
        })
    }


    $: currentPlaceName = getPlaceName(currentPlace)
    $: anotherPlaceName = getPlaceName(getAnotherPlace(currentPlace))
    $: anotherPlaceImg = getImagePath(getPlaceName(getAnotherPlace(currentPlace), true));

    (async () => {
        currentPlace = await window.electron.get('currentPlace')
        showAutomaticChangeEnable = await window.electron.isAutomaticPaused()
    })()
</script>

<Window showAutomaticChangeEnable={showAutomaticChangeEnable}
        updateShowAutomaticChangeEnable={()=>{showAutomaticChangeEnable=false}}>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.main.main} height={320}>
        <List twoLine avatarList style="padding-top: 10px;">
            <Item on:SMUI:action={changePlace}>
                <Graphic style="background-image: url({anotherPlaceImg});background-size: 100% 100%;"/>
                <Text>
                    <PrimaryText>IP 변경</PrimaryText>
                    <SecondaryText>IP를 {anotherPlaceName}로 변경해요.</SecondaryText>
                </Text>
            </Item>
            <Item on:SMUI:action={() => {developing.open()}}>
                <Graphic
                        style="background-image: url({getImagePath('vpn')});background-size: 100% 100%;border-radius:0!important;"/>
                <Text>
                    <PrimaryText>VPN</PrimaryText>
                    <SecondaryText>VPN을 설정해요.</SecondaryText>
                </Text>
            </Item>
            <Item on:SMUI:action={moveToPage(PAGE.main.setting)}>
                <Graphic style="background-image: url({getImagePath('setting')});background-size: 100% 100%;"/>
                <Text>
                    <PrimaryText>설정</PrimaryText>
                    <SecondaryText>옵션을 변경해요.</SecondaryText>
                </Text>
            </Item>
            <Item on:SMUI:action={moveToPage(PAGE.main.about)}>
                <Graphic style="background-image: url({getImagePath('info')});background-size: 100% 100%;"/>
                <Text>
                    <PrimaryText>정보</PrimaryText>
                    <SecondaryText>IP의 정보를 확인해요.</SecondaryText>
                </Text>
            </Item>
        </List>
    </Container>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.main.about} height={320}>
        <About moveToPage={moveToPage}/>
    </Container>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.main.setting} height={320}>
        <Setting moveToPage={moveToPage} developing={developing}/>
    </Container>
    <Container fadeout={fadeout} currentPage={currentPage} targetPage={PAGE.main.loading} height={320}>
        <Loading/>
    </Container>

    <Snackbar bind:this={changedNotify}>
        <Label>IP를 {currentPlaceName}로 변경했어요!</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
    <Snackbar bind:this={errorNotify}>
        <Label>오류로 인해 IP를 바꾸지 못했어요.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
    <Snackbar bind:this={developing}>
        <Label>아직 개발 중이에요!</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
</Window>
