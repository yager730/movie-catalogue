export interface MovieDetails {
    id: number,
    title: string,
    tagline: string | null,
    runtime: number | null,
    release_date: string,
    poster: string | null,
    overview: string
}

// cast: {
    //     adult: boolean,
    //     gender: number | null,
    //     id: number,
    //     known_for_department: string,
    //     name: string,
    //     original_name: string,
    //     popularity: number,
    //     profile_path: string | null,
    //     cast_id: number,
    //     character: string,
    //     credit_id: string,
    //     order: number 
    // } [],
    // crew: {
    //     adult: boolean,
    //     gender: number | null,
    //     id: number,
    //     known_for_department: string,
    //     name: string,
    //     original_name: string,
    //     popularity: number,
    //     profile_path: string | null,
    //     credit_id: string,
    //     department: string,
    //     job: string 
    // } []
