//IMPORTA EXPRESS
const express = require("express");
const cors = require("cors");

//IMPORTA CONEXÃO COM O BANCO
const conn = require("./db/conn");

//MODELS
const Usuario = require("./models/Usuario");
const Movel = require("./models/Movel");

//CONTROLLERS
const UsuarioController = require("./controllers/UsuarioController");
const MoveisController = require("./controllers/MoveisController");

//ROUTES
const routesUsuario = require("./routes/routesUsuario");
const routesMovel = require("./routes/routesMovel");

//INVOCA EXPRESS
const app = express();

//SOLUCIONA PROBLEMA DE CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//RECEBANDO DADOS VIA JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ARQUIVOS ESTÁTICOS DO SERVIDOR
app.use(express.static("public"));

//ROTAS
app.use("/usuario", cors(), routesUsuario);
app.use("/moveis", cors(), routesMovel);

//EXECUTANDO API
conn
  // FORÇA API A RECRIAR O BANCO DO ZERO
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(5000);
    console.log("Rodando na porta: ", 5000);
  })
  .catch((err) => {
    console.log(err);
  });
