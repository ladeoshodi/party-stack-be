import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

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
  components: {
    schemas: {
      userSchema: {
        $username: "Username of user",
        $email: "email of user",
        $password: "password of user",
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
