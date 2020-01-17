<p align="center">
  <img src="chess.png" alt="chess" width="200" style="border-radius: 4px;"/>
</p>

## Overview

Chess Mate is a web chess game that allows players to play with their friends on the same browser and also saves the game progress in case the user wants to play later and it does not ask for registration.

This is only the backend, you can access the frontend repository in [here](https://github.com/igorsouza-dev/chessgame-frontend)

If you wish to play the game you can click [here](https://chess-front.herokuapp.com/)

## Table of contents

- [Setting up](#setting-up)
  - [Requirements](#requirements)
  - [Dependencies](#dependencies)
  - [Dev dependencies](#dev-dependencies)
  - [Database Configuration](#database-configuration)
  - [Sentry Configuration](#sentry-configuration)
- [Understanding the project](#understanding-the-project)
  - [Folder Structure](#folder-structure)
  - [Application flow](#application-flow)
  - [Middewares](#middlewares)
  - [Routes](#routes)
  - [Database structure](#database-structure)
  - [Constants](#constants)
  - [The game logic](#game-logic)
- [Contributing](#contributing)
- [License](#license)

## Setting up

### Requirements

- [Node.js](https://nodejs.org/en/download/)
- [Npm](https://www.npmjs.com/get-npm)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) - This is optional but in this readme I'll be using it on some CLI commands, you can use npm if you want.

### Dependencies

These are some of the libraries that I used in this project

- [Sequelize](https://sequelize.org/) - Promise-based Node.js ORM for Postgres and Sqlite
- [Express](https://expressjs.com/) - Node.js web application framework for API building
- [Pg](http://github.com/brianc/node-postgres) - PostgreSQL client for Node.js
- [Sqlite3](https://github.com/mapbox/node-sqlite3) - Sqlite client for Node.js
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Hashing library
- [Dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a .env file
- [Youch](https://github.com/poppinss/youch) - Pretty error reporting for Node.js
- [Sentry](https://sentry.io) - Exception handler used on production

### Dev Dependencies

- [Sucrase](https://github.com/alangpierce/sucrase) - Babel alternative
- [Nodemon](https://nodemon.io/) - monitor for any changes in code and automatically restart server
- [Eslint](https://eslint.org) - Ecmascript linter
- [Prettier](https://prettier.io) - Code formatter
- [Jest](https://jestjs.io/) - Testing framework
- [Supertest](https://github.com/visionmedia/supertest) - Library for testing node.js HTTP servers

### Database Configuration

There are 3 settings that you can use in this project: `test`, `production` and `development`. Test and configuration will use `sqlite` and create a `.sqlite3` file inside the folder `src/database/db`. On production, it will use `postgres`. You should set the `NODE_ENV` in your `.env` file. You can copy the `.env.example` and follow the same structure of configuration.

I've added some scripts to make easier the migrations of the databases. If you run `yarn migrate` or `yarn migrate:reset` it will update your database. It will chose the correct database to migrate depending on the `NODE_ENV` you set up.

When you run `yarn test`, it will automatically set your environment to `test` and migrate the testing database;

**↑ back to:** [Table of contents](#table-of-contents)

### Sentry Configuration

[Sentry](https;//sentry.io) is a great tool for monitoring exceptions that eventually may happen in production. All you have to do is add a `SENTRY_DSN` in your `.env` file and run the project with `NODE_ENV=production`.

**↑ back to:** [Table of contents](#table-of-contents)

## Understanding the project

### Folder structure

```
|-- src
  |-- app
    |-- controllers
      |-- GameController.js
    |-- middlewares
      |-- browserId.js
      |-- lastBoard.js
    |-- models
      |-- Board.js
      |-- Game.js
      |-- Move.js
  |-- config
    |-- database.js
    |-- sentry.js
  |-- database
    |-- migrations
    -index.js
  |-- game_logic
  -app.js
  -routes.js
  -server.js

```

**↑ back to:** [Table of contents](#table-of-contents)

### Application flow

The basic idea behind the project is to allow the user to play the game and save the progress without the need of registration. In order to achieve this, we need some kind of identification that needs to be created and stored in the user's browser, we will call this `browser_id`, next, when the user opens the app, it will send this identification to the server and then the server will look for the last board state for the game that the user is playing and return this data to the browser.

**↑ back to:** [Table of contents](#table-of-contents)

### Middlewares

- `browserId.js`: responsible for looking for the browser id in the custom request header called `browser_id`. If the browser id is valid, it tries to look for a game with the same browser_id on the `games` table on the database. If there is a row, then the middleware will inject the game model inside the request that can be later accessed in the controller through the request object.
- `lastBoard.js`: looks for the last board row on the database for the current game that the user is playing and injects it in the request.

**↑ back to:** [Table of contents](#table-of-contents)

### Routes

| Routes                 | Method | Middleware           |
| ---------------------- | ------ | -------------------- |
| /new-game              | POST   |                      |
| /load-game             | GET    | browserId            |
| /legal-moves/:position | GET    | browserId            |
| /make-move/:from/:to   | GET    | browserId, lastBoard |

**↑ back to:** [Table of contents](#table-of-contents)

### Database structure

- **Games**
  This is the main table that has the browser id used by server to find the current state of the game.
  - id
  - browser_id (hashed id generated by the server and returned to the client that sent the request)
- **Boards**
  This table holds the state of the game, each move will generate a new board. Imagine this table as a snapshot of that moment of the game
  - id
  - game_id - has a relatio with the games table
  - board - A JSON of the current board state
  - move_number - A sequence number that helps with history navigation
  - turn_player - the player who made the move
  - score - A JSON containing the amount of enemy pieces the turn player have
- **Moves**
  This table will hold individual moves for every move made
  - id
  - move_number - A sequence number that helps with history navigation
  - player - who made the move
  - from - origin position
  - to - target position
  - piece - the piece
  - flag - `-` for normal move, `x` for attack

**↑ back to:** [Table of contents](#table-of-contents)

### Constants

```js
// pieces
export const KNIGHT = 'N';
export const PAWN = 'P';
export const KING = 'K';
export const BISHOP = 'B';
export const QUEEN = 'Q';
export const ROOK = 'R';

// players
const WHITE = 'W';
const BLACK = 'B';
```

**↑ back to:** [Table of contents](#table-of-contents)

### Game Logic

You may be asking, why build your own logic if we have libraries like [chess.js](https://github.com/jhlywa/chess.js/) that already have everything implemented? The answer is simple, I only did this for education purposes. I wanted to know if I was going to be able to do the logic myself.

The core of the game logic lies in the **Pieces Offsets**, **Pawn Offsets** and **Squares** arrays.

```js
// prettier-ignore
export const SQUARES = {
  a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
  a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
  a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
  a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
  a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
  a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
  a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
```

```js
// prettier-ignore
export const PIECE_OFFSETS = {
  N: [-18, -33, -31, -14, 18, 33, 31, 14],
  B: [-17, -15, 17, 15],
  R: [-16, 1, 16, -1],
  Q: [-17, -16, -15, 1, 17, 16, 15, -1],
  K: [-17, -16, -15, 1, 17, 16, 15, -1],
};
export const PAWN_OFFSETS = {
  B: [16, 32, 17, 15],
  W: [-16, -32, -17, -15],
};
```

The `SQUARES` object is used for the board construction on the frontend and also for the calculation of legal moves. Each key is a square on the chess board using the algebraic notation, and the value for each key will be used later with the offsets in order to calculate which are the legal moves. Each rank on the object skips 8 numbers on purpose because we are also going to use bitwise operator to know if a piece is inside the board after the offset calculation. So, in rank 8 (a8, b8, c8, d8, e8, f8, g8, h8) we have 0 to 7, in rank 7 (a7, b7, c7, d7, e7, f7, g7, h7) we have 16 to 23 and so on and so forth.
When asked for the legal moves, the server will need the algebraic position of the board. This will look for the last board state on the database, find which piece is there and use an initial of the piece to select the correct row of offsets in the `PIECE_OFFSETS`, if the piece is a Pawn, it will look in the `PAWN_OFFSETS` object with the help of the color of the piece. That is necessary because black pieces only move downwards, while the white pieces move upwards.
Let's use an example to makes things clear, let's imagine if there is a white Knight at the B1 position:

Frontend makes request:
GET /legal-moves/b1

Server checks if there is actually a piece on this position and if the piece belongs to the player that have the turn. In this case, there is a piece and it is a Knight.

The square position B1 has a value of `113`. The knight's offsets are `N: [-18, -33, -31, -14, 18, 33, 31, 14],` so we have to loop throught the array and sum every offset with the position value:

Rules:

- value can't be less than 0
- value can't be more than 119
- Bitwise 8 has to give 0

```
113 + (-18) = 95 => (95 & 8) === 8 > outside board
113 + (-33) = 80 => (80 & 8) === 0 > A3
113 + (-31) = 82 => (82 & 8) === 0 > C3
113 + (-14) = 99 => (82 & 8) === 0 > D2
113 + 18 = 131 => 131 > 119 => outside board
113 + 33 = 146 => 146 > 119 => outside board
113 + 31 = 144 => 144 > 119 => outside board
113 + 14 = 127 => 127 > 119 => outside board
```

So, in B1, the Knight can move to A3, C3, D2. The next step is checking if there is a piece on this destination squares, if there is one, check if it is the enemy's piece.
The logic for the Knight is a little bit different from than the other ones because it can jump pieces on it's path. The king follows the same logic but it can only move one square per turn in any direction.

For the Bishop, Rook and Queen, the logic is almost the same as the Knight. The difference is that the array of offsets for one of those pieces contain values that we are suppose to increment, where each value is responsible for one direction. For example, the rook contain a `-16` value, this will give the top direction, so as we are going through the array of offsets, we have to increment this value to the position value, this will generate a ray of squares and this loop will continue until getting to the end of the board or encountering another piece.

The pawn logic uses the same logic but using the color as another way of getting the offsets. Also, I've implemented the initial double jump when the Pawn is at the second rank and it can only move diagonally when there is an enemy.

There is no need to inform which player has the turn, the `/make-move` will look in the database which one played last time and set the other player as the current turn holder. Also, after every move made, it will return the current board state, and the move made. The move object also contains a flag that indicates an event: `-` when it's a normal move, `x` when it was an attack.

**↑ back to:** [Table of contents](#table-of-contents)

## Contributing

This project is still under development and there are a lot of features needed to be done. If you wish to contribute,
please take a moment to read the [Contribution Guidelines](CONTRIBUTING.md).

**↑ back to:** [Table of contents](#table-of-contents)

## License

This is a open-sourced software licensed under the [MIT license](LICENSE.md).

**↑ back to:** [Table of contents](#table-of-contents)
