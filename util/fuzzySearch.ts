import Fuse, { IFuseOptions } from "fuse.js";

const DEFAULT_FUSE_CONFIG: IFuseOptions<string> = {
    minMatchCharLength: 4,
    findAllMatches: true,
    ignoreDiacritics: true,
    includeScore: true,
    shouldSort: true,
    ignoreLocation: true,
    ignoreFieldNorm: true
}

export default function fuzzySearch(input: string, array: string[], options?: Partial<IFuseOptions<string>>) {
    const fuse = new Fuse(array, {...DEFAULT_FUSE_CONFIG, ...options})
    return fuse.search(input)
}