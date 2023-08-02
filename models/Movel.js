//IMPORTA DATATYPES DO SEQUELIZE
const { DataTypes } = require("sequelize");

//IMPORTA MODEL DO USUARIO
const Usuario = require("../models/Usuario");

//IMPORTA CONEXÃO COM API
const db = require("../db/conn");

const Movel = db.define(
  "Movel",
  {
    idMovel: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "idUsuario",
      },
    },
    nomeProduto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    condicao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeVendedor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefoneVendedor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    situacao: {
      type: DataTypes.BOOLEAN,
    },
    idComprador: {
      type: DataTypes.STRING,
    },
    nomeComprador: {
      type: DataTypes.STRING,
    },
    telefoneComprador: {
      type: DataTypes.STRING,
    },
  },
  { db, modelName: "movel", tableName: "moveis" }
);

module.exports = Movel;
