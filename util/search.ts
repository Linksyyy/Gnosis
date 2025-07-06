import Fuse from "fuse.js";

export default function(input : string, array : string[]) {
    const fuse = new Fuse(array, {
        minMatchCharLength: 3,
        findAllMatches: true,
        ignoreDiacritics: true,
        includeScore: true,
        shouldSort: true,
        ignoreLocation: true
    })

    return fuse.search(input)
}