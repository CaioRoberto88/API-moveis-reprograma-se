//IMPORTA SEQUELIZE
const { Sequelize } = require("sequelize");

//CONFIGURAÇÃO DO BANCO EM SQLITE3
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "projetomoveis.sqlite",
});

// TRATA EVENTUAIS ERROS
try {
  sequelize.authenticate();
  console.log("Conexão com API realizada com sucesso!");
} catch (error) {
  console.log("Houve um erro de conexão com a API", error);
}

module.exports = sequelize;
