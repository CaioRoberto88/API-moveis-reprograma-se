//IMPORTA ROUTER DO EXPRESS
const express = require("express");

//IMPORTANDO CONTROLLERS
const UsuarioController = require("../controllers/UsuarioController");

//HELPERS
const checaUsuarioToken = require("../helpers/checa-usuario-token");

//INVOCA ROUTER DO EXPRESS
const router = express.Router();

// ---------- CADASTRO --------- //
router.post("/cadastro", UsuarioController.cadastro);

// ---------- LOGIN --------- //
router.post("/login", UsuarioController.login);

//CHECA USUÁRIO TOKEN
router.get("/checausuariotoken", checaUsuarioToken, UsuarioController.checaUsuario);

//RESGATA USUARIO PELO ID
router.get("/:id", UsuarioController.pegaUsuarioId);

//EDITA USUARIO
router.patch("/edita/:id", checaUsuarioToken, UsuarioController.editaUsuario);


module.exports = router;
