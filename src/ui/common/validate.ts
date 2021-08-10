export function validateUserId(userId: string) {
    let a, b, c;
    if (!userId) return false
    else if (userId.length !== String(parseInt(userId)).length) return false
    else if (userId.length < 4) return false
    else if (userId.length > 5) return false
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
        if (a > 3 || a < 1) return false
        else if (b > 5 || b < 1) return false
        else return !(c > 16 || c < 1);
    }
}