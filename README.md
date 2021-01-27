# DSA Web App 

Public web application for DSA (Direct Selling Agent). 
This is part of **[MMK LAP](https://mymoneykarma.atlassian.net/wiki/spaces/LAP/)** product (Loan Against Property).  

## Configuration

We use `.env` variables and values in `localStore` to configure the Web App

- `env.REACT_APP_API` - base URL of API/Server  
- `localStore.api` - base URL of API/Server, overrides `env.REACT_APP_API` value

## Technologies

- Core frontend library is [ReactJs](https://reactjs.org/)

- Visual styles provided by [Material-UI](https://material-ui.com/)

- Bootstrapped as [Create React App](https://github.com/facebook/create-react-app) using [TypeScript](https://www.typescriptlang.org/) template

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run code-format`

Formats the code according to `./prettierrc.js` config

### `npm run type-check`

Runs TypeScript compiler according to `./tsconfig.json` config to verify the code for errors

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

