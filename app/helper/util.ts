export function capitalize(word : any) : string {
    word = word.toString();
    return word.substring(0, 1).toUpperCase() + word.substring(1);
}

