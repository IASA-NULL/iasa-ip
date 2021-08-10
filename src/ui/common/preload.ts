import type {PLACE} from "../../const";

export {};

declare global {
    interface Window {
        electron: {
            openWebPage: (src: string) => void,
            close: () => void,
            get: (key: string) => Promise<any>,
            set: (key: string, value: any) => void,
            changeToPlace: (place: PLACE) => Promise<boolean>,
            enableAutomaticChange: () => void,
            isAutomaticPaused: () => Promise<boolean>,
            openIdChangeWindow: () => {}
        }
    }
}