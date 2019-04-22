
export type Id = number;

export function hasPrefix(s: string, p: string): boolean {
    return s.indexOf(p) === 0
}

export function hasSuffix(s: string, p: string): boolean {
    let n = s.length - p.length;
    if (n < 0) {
        return false;
    }
    return s.lastIndexOf(p) === n
}
