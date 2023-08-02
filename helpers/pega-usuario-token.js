//IMPORTA JSON WEB TOKEN - JWT
const jwt = require("jsonwebtoken");

//IMPORTA MODEL USUÁRIO
const Usuario = require("../models/Usuario");

//PEGA USUARIO PELO JWT TOKEN
const pegaUsuarioToken =  async (token, res) => {


  if(!token) {
    return res.status(401).json({message: "Acesso Negado!"});
  }

  const decoded = jwt.verify(token, "nossoSecret");

  const idUsuario = decoded.id;
   
  const usuario = await Usuario.findOne({ where: { idUsuario: idUsuario }} );
  
  return usuario;
}

module.exports = pegaUsuarioToken;