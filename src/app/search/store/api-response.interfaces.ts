export interface SearchResponseData {
    page: number;
    results: {
        poster_path: string | null;
        adult: boolean;
        overview: string;
        release_date: string;
        genre_ids: number[];
        id: number;
        original_title: string;
        original_language: string;
        title: string;
        backdrop_path: string | null;
        popularity: number;
        vote_count: number;
        video: boolean;
        vote_average: number; } [];
    dates?: {
        maximum: string;
        minimum: string; } [];
    total_results: number;
    total_pages: number;
}

export interface MovieDetailsResponseData {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: null | object;
    budget: number;
    genres: {
        id: number;
        name: string;
    } [];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: {
        name: string;
        id: number;
        logo_path: string | null;
        origin_country: string; } [];
    production_countries: {
        iso_3166_1: string;
        name: string; } [];
    release_date: string;
    revenue: number;
    runtime: number | null;
    spoken_languages: {
        iso_639_1: string;
        name: string; } [];
    status: string;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number
}

export interface CrewResponseData {
    id: number,
    cast: {
        adult: boolean,
        gender: number | null,
        id: number,
        known_for_department: string,
        name: string,
        original_name: string,
        popularity: number,
        profile_path: string | null,
        cast_id: number,
        character: string,
        credit_id: string,
        order: number } [],
    crew: {
        adult: boolean,
        gender: number | null,
        id: number,
        known_for_department: string,
        name: string,
        original_name: string,
        popularity: number,
        profile_path: string | null,
        credit_id: string,
        department: string,
        job: string } []
}

export interface MovieImagesResponseData {
    id: number,
    backdrops: {
        aspect_ratio: number,
        file_path: string,
        height: number,
        iso_639_1: string | null,
        vote_average: number,
        vote_count: number,
        width: number
    } [],
    posters: {
        aspect_ratio: number,
        file_path: string,
        height: number,
        iso_639_1: string | null,
        vote_average: number,
        vote_count: number,
        width: number
    } []
}
