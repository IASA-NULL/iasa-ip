import {Notification} from 'electron'
import {PLACE} from "../const";
import path from "path";

function createNotify(title: string, body: string, icon = 'logo') {
    let notification = new Notification({
        title: title,
        body: body,
        icon: path.join(__dirname, '..', '..', 'res', 'img', icon + '.png')
    });
    notification.show();
}

export function changedToPlace(place: PLACE) {
    if (place === PLACE.home) createNotify('IP 변경됨', 'IP를 학교 외부망으로 변경했어요.', 'home_plain')
    if (place === PLACE.school) createNotify('IP 변경됨', 'IP를 학교 내부망으로 변경했어요.', 'school_plain')
}

export function pausedAutomaticChange() {
    createNotify('자동 변경 중지됨', '재시작 전까지 IP 자동 변경을 비활성화했어요. 자동변경을 키려면 메뉴를 누르세요.', 'setting_plain')
}

export function startingService() {
    createNotify('서비스 시작중...', 'IP의 서비스가 종료돼서 재시작하고 있어요. 잠시만 기다리세요.', 'setting_plain')
}

export function updating() {
    createNotify('업데이트를 다운받는 중...', '업데이트를 다운받고 있어요. 잠시만 기다리세요.', 'up_plain')
}