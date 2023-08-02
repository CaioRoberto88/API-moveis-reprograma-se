//IMPORTA DATATYPES DO SEQUELIZE
const { DataTypes } = require("sequelize");

//IMPORTA CONEXÃO COM API
const db = require("../db/conn");

const Usuario = db.define(
  "Usuario",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
    },
  },
  { db, modelName: "usuario", tableName: "usuarios" }
);

module.exports = Usuario;
