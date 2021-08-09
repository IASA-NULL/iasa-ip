export enum PLACE {
    unknown,
    home,
    school
}

export function getAnotherPlace(place: PLACE) {
    if (place === PLACE.home) return PLACE.school
    if (place === PLACE.school) return PLACE.home
    return PLACE.unknown
}

export function getPlaceName(place: PLACE, english = false) {
    if (english) {
        if (place === PLACE.unknown) return 'unknown'
        if (place === PLACE.home) return 'home'
        if (place === PLACE.school) return 'school'
    } else {
        if (place === PLACE.unknown) return '로드 중'
        if (place === PLACE.home) return '집으'
        if (place === PLACE.school) return '학교'
    }
}

export enum PAGE {
    main,
    about,
    setting,
    loading
}