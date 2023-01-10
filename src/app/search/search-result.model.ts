export class SearchResult {
    constructor(
        public id: number,
        public title: string,
        public overview: string, 
        public poster: string | null
    ) {}
}