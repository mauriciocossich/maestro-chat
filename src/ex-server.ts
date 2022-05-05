import express from "express";

import "./database"; // JS identifica o index.ts só importando a pasta

const app = express();

/*
Métodos de requisições HTTP
GET = Busca
POST = Criação
PUT = Alteração
DELETE = Deletar
PATCH = Alterar info específica
*/

app.get("/", (request, response) => {
  return response.json({
    message: "Olá Maestro, saudades!",
  });
});

app.post("/", (request, response) => {
  return response.json({ message: "Usuário salvo com sucesso" });
});

app.listen(3333, () => console.log("Server is running on port 3333"));
