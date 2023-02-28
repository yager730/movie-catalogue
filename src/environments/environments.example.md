## Environments Example
The following code block gives a general overview of the `environments.ts` file structure. Please create such a file in this directory and replace the `TMDB_API_key`, `Auth_API_key`, and `Firebase_Base_URL` fields with your own generated information as described by the `README` file.

```ts
export const environment = {
    production: false,
    TMDB_API_key: 'XXXXXXXXXXXXXXXXXXXX',
    Auth_API_key: 'XXXXXXXXXXXXXXXXXXXX',

    Firebase_Base_URL: 'https://your-firebase-project.com',
    Auth_Base_URL: 'https://identitytoolkit.googleapis.com',
    TMDB_Base_URL: 'https://api.themoviedb.org/3',
    TMDB_Images_URL: 'https://image.tmdb.org/t/p/original'
};
```

<br />
<hr />
<br />

[Link to Firebase](https://firebase.google.com/) 

[Link to TMDB API](https://developers.themoviedb.org/3/getting-started/introduction)
