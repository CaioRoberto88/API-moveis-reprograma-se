//IMPORTA ROUTER DO EXPRESS
const express = require("express");

//IMPORTANDO CONTROLLERS
const MoveisController = require("../controllers/MoveisController");

//HELPERS
const checaUsuarioToken = require("../helpers/checa-usuario-token");

//INVOCA ROUTER DO EXPRESS
const router = express.Router();

//ROTA DE CADASTRO DE MOVEIS
router.post("/cadastro", MoveisController.cadastro);

//ROTA PUBLICA QUE MOSTRA TODOS OS MOVEIS DISPONÍVEIS A VENDA
router.get("/pegatodosmoveis", MoveisController.pegaTodosMoveis);

//ROTA PEGA TODOS OS MEUS MOVEIS QUE ESTOU VENDENDO
router.get("/pegameusmoveis", checaUsuarioToken, MoveisController.pegaTodosMeusMoveis);

//ROTA COM OS MOVEIS QUE TENHO INTERESSE EM COMPRAR
router.get("/moveisquerocomprar", checaUsuarioToken, MoveisController.pegaMoveisQueroComprar);

//ROTA PEGA DETALHES DO MOVEL PELO ID
router.get("/:id", MoveisController.pegaMovelId);

//ROTA DELETE MOVEL
router.delete("/removemovel/:id", checaUsuarioToken, MoveisController.removeMovelId);

//ROTA ATUALIZAÇÃO DE DADOS DO MOVEL
router.patch("/atualizamovel/:id", checaUsuarioToken, MoveisController.atualizaMovel);

//ROTA DE INTERESSE DE COMPRAR MOVEL
router.put("/desejocomprar/:id", checaUsuarioToken, MoveisController.desejoComprar);

//ROTA DE CANCELAMENTO DE COMPRA DE MOVEL
router.put("/cancelavenda/:id", checaUsuarioToken, MoveisController.cancelaVenda)

//ROTA DE CONCLUSÃO DE VENDA DE MOVEL
router.put("/vendaconcluida/:id", checaUsuarioToken, MoveisController.compraConcluida);

module.exports = router;
