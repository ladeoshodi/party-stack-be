import swaggerAutogen from "swagger-autogen";
import { PORT } from "./config/environment";

const options = {
  openapi: "3.1.0",
};

const doc = {
  info: {
    title: "Party Stack API with Swagger",
    version: "1.0.0",
    description: "This is the API documentation for Party Stack API",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Lade Oshodi",
      url: "https://github.com/ladeoshodi",
    },
  },
  tags: [
    {
      name: "User",
      description: "User API",
    },
    {
      name: "Games",
      description: "Games API",
    },
    {
      name: "Comments",
      description: "Comments API",
    },
  ],
  components: {
    schemas: {
      userSchema: {
        $username: "Username of user",
        $email: "email of user",
        $password: "password of user",
      },
      gameSchema: {
        $title: "Title of the game",
        imageUrl: "Game image",
        $creator: "Ref to a user",
        $description: "Description of the game",
        $gameSetup: "How to setup the game, tools needed e.t.c",
        $howToPlay: "How to play the game",
        rating: 3,
      },
    },
    securitySchemes: {
      Authorization: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ Authorization: [] }],
  servers: [
    { url: `http://localhost:${PORT}/api`, description: "Development server" },
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["src/routes/index.ts"];

swaggerAutogen(options)(outputFile, routes, doc);
