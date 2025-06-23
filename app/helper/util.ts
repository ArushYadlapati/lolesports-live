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

