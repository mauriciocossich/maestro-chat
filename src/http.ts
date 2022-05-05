import express from "express";
import { createServer } from "http"; // protocolo http default do node
import { Server, Socket } from "socket.io";
import path from "path"; // Módulo do node para ler caminho de arquivo

import "./database"; // JS identifica o index.ts só importando a pasta
import { routes } from "./routes";

const app = express();

// Definir onde estarão os arquivos públicos para o browser acessar
// Config para utilizar o html dentro das rotas
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/client", (request, response) => {
  return response.render("html/client.html");
});

app.get("/pages/admin", (request, response) => {
  return response.render("html/admin.html");
});

const http = createServer(app); // Criando protocolo http
const io = new Server(http); // Criando protocolo WS

io.on("connection", (socket: Socket) => {
  //   console.log("Se conectou, ", socket.id);
});

app.use(express.json());

app.use(routes);

export { http, io };
