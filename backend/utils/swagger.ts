import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NTNUI VOTE API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.ts"],
};
