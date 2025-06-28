/**
 * Capitalize the first letter of a string.
 * Used for league names in Buttons
 *
 * @param word the word to capitalize
 */
export function capitalize(word : any) : string {
    word = word.toString();
    return word.substring(0, 1).toUpperCase() + word.substring(1);
}

export function getTooltip(text: string, scheme: any) {
    return (
        <span className="relative cursor-pointer">
            <span className="w-6 h-6 flex items-center justify-center text-base font-bold rounded-full border group"
                  style={{ color: scheme.background, backgroundColor: scheme.foreground, borderColor: scheme.foreground}}
            >
                ?
                <div style={{ backgroundColor: scheme.foreground }}
                     className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-xs text-xs
                     text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
                >
                    { text }
                </div>
            </span>
        </span>
    );
}