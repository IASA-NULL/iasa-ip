<script lang="ts">
    import IconButton from '@smui/icon-button'
    import Menu from '@smui/menu'
    import List, {Item, Text} from '@smui/list'
    import Tooltip, {Wrapper} from '@smui/tooltip'
    import {version} from '../../../../package.json'

    let menu;
    export let showAutomaticChangeEnable = false, updateShowAutomaticChangeEnable;

    function openMenu() {
        menu.setOpen(true)
    }

    function enableAutomaticChange() {
        window.electron.enableAutomaticChange()
        updateShowAutomaticChangeEnable()
    }
</script>

<style>
    .titlebar {
        width: calc(100% - 40px);
        height: 40px;
        padding: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
    }

    .wrapper {
        width: 100%;
        height: 100vh;
    }

    .appTitle, .appTitle * {
        color: var(--mdc-theme-on-surface);
        font-family: 'FontB';
        font-weight: 300;
        font-size: 30px;
        margin: 0 5px 0 0;
    }

    .version {
        font-size: 20px;
    }
</style>

<div class="wrapper">
    <header class="titlebar">
        <span class="appTitle">IP <span class="version">{version}</span></span>
        <div>
            <Wrapper>
                <IconButton class="material-icons" on:click={openMenu} style="color:var(--mdc-theme-on-surface);">
                    more_vert
                </IconButton>
                <Tooltip>메뉴</Tooltip>
            </Wrapper>
            <Menu bind:this={menu}>
                <List>
                    {#if showAutomaticChangeEnable}
                        <Item on:SMUI:action={enableAutomaticChange}>
                            <Text style="color:var(--mdc-theme-on-surface);">자동변경 다시 활성화</Text>
                        </Item>
                    {/if}
                    <Item on:SMUI:action={() => {window.electron.close()}}>
                        <Text style="color:var(--mdc-theme-on-surface);">IP 종료하기</Text>
                    </Item>
                </List>
            </Menu>
        </div>
    </header>
    <slot></slot>
</div>
