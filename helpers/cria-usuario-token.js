//IMPORTA JSON WEB TOKEN
const jwt = require("jsonwebtoken");

const criaUsuarioToken = async (usuario, req, res) => {
  
  //CRIA TOKEN
  const token = jwt.sign(
    {
      nome: usuario.nome,
      id: usuario.idUsuario,
    },
    "nossoSecret",
    {
      expiresIn: 3600000
    }
  );

  //RETORNA TOKEN
  res.status(200).json({
    sucess: "Você está autenticado",
    token: token,
    idUsuario: usuario.idUsuario,
  });
};

module.exports = criaUsuarioToken;
