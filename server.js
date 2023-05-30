const express = require("express");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const healthRoutes = require("./routes/health");
const { logger } = require("./middleware/logger");
const { ZodError } = require("zod");

const server = express();
server.use(express.json());

server.use(healthRoutes.router);
server.use(productsRoutes.router);
server.use(usersRoutes.router);

server.use((err, req, res, next) => {
  if (err instanceof ZodError)
    return res.status(422).json({
      message: err.errors,
    });
  res.status(500).json({ message: "Server Error " });
});

module.exports = { server };
