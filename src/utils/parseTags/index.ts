export function parseTags(text: string | undefined): readonly string[] {
    return (text ?? '')
        .trim()
        .toLowerCase()
        .split(/[\s\n]/)
        .map(line => line.trim())
        .filter(Boolean);
}
