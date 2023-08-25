export function nmod(input: number, base: number) {
    return ((input % base) + base) % base;
}