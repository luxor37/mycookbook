## Coding style for contributions

 -`yarn` over `npm` at all times
 - User the `Composition API` over the `Options API` (https://vueschool.io/articles/vuejs-tutorials/options-api-vs-composition-api/)
 - interfaces in the `/types/` folder (with the exception of a Props interface in each component receiving Props)

## Setup

Make sure to install the dependencies:

```bash
yarn
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn generate
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
