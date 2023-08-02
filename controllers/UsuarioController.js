//IMPORTANDO MODEL USUARIO
const Usuario = require("../models/Usuario");

//IMPORTA BCRYPT - CRIPTOGRAFAR A SENHA DO USUÁRIO
const bcrypt = require("bcrypt");

//IMPORTA JSON WEB TOKEN - JWT
const jwt = require("jsonwebtoken");

//IMPORTA HELPERS
const criaUsuarioToken = require("../helpers/cria-usuario-token");
const pegaToken = require("../helpers/pega-token");
const pegaUsuarioToken = require("../helpers/pega-usuario-token");

module.exports = class UsuarioController {
  // ============== CADASTRO USUARIO ============== //
  static async cadastro(req, res) {
    //PASSA TODOS DADOS DO FORMULÁRIO
    const { nome, email, senha, confirmaSenha, telefone, imagem } = req.body;

    // ==============  VALIDAÇÃO DE CAMPO DE USUÁRIO ============== //
    if (!nome) {
      res.status(422).json({ message: "Campo nome é obrigatório!" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "Campo e-mail é obrigatório!" });
      return;
    }

    // ============== CHECA SE JÁ EXISTE EMAIL CADASTRADO NO BANCO ============== //
    const checaEmail = await Usuario.findOne({ where: { email: email } });
    if (checaEmail) {
      res.status(422).json({ message: "E-mail já está em uso, tento outro!" });
      return;
    }

    if (!senha) {
      res.status(422).json({ message: "Campo senha é obrigatório!" });
      return;
    }

    if (!confirmaSenha) {
      res.status(422).json({ message: "Campo confirma senha é obrigatório!" });
      return;
    }

    // ============== CHECA SE OS CAMPOS SENHAS SÃO IGUAIS ============== //
    if (senha !== confirmaSenha) {
      res
        .status(422)
        .json({ message: "As senhas não estão iguais, tente novamente!" });
      return;
    }

    if (!telefone) {
      res.status(422).json({ message: "Campo telefone é obrigatório!" });
      return;
    }

    //CRIA SENHA DO USUARIO
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

    //AVATAR PADRÃO
    let avatar = "https://i.ibb.co/7g2MvMj/avatar-padrao.png";

    //CRIA USUARIO
    const usuario = {
      nome,
      email,
      senha: passwordHash,
      telefone,
      imagem: avatar,
    };

    try {
      const novoUsuario = await Usuario.create(usuario);

      await criaUsuarioToken(novoUsuario, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // =========== LOGIN DE USUÁRIO ========== //

  static async login(req, res) {
    const { email, senha } = req.body;

    //TRATA POSSIVEIS ERROS DE LOGIN - COMO CAMPOS VAZIOS

    if (!email) {
      res.status(422).json({ message: "Campo de email vazio!" });
      return;
    }

    if (senha == " " || senha == null || senha == undefined) {
      console.log(senha);
      res.status(422).json({ message: "Campo de senha vazio!" });
      return;
    }

    //VALIDA EMAIL DE USUARIO
    const compararEmailUsuario = await Usuario.findOne({
      where: { email: email },
    });

    if (!compararEmailUsuario) {
      res.status(422).json({ message: "Usuario não existe!" });
      return;
    }

    //VALIDA SENHA DE USUÁRIO
    const comparaSenha = bcrypt.compareSync(senha, compararEmailUsuario.senha);

    if (!comparaSenha) {
      res.status(422).json({ message: "Senha Inválida!" });
      return;
    }

    await criaUsuarioToken(compararEmailUsuario, req, res);
  }

  static async checaUsuario(req, res) {
    let usuarioAtual;

    if (req.headers.authorization) {
      const token = pegaToken(req);

      const decoded = jwt.verify(token, "nossoSecret");

      usuarioAtual = await Usuario.findByPk(decoded.id);

      //ZERA A SENHA DO RETORNO
      usuarioAtual.senha = undefined;
    } else {
      usuarioAtual = null;

      return;
    }

    res.status(200).json(usuarioAtual);
  }

  //PEGA USUARIO PELO ID
  static async pegaUsuarioId(req, res) {
    let idUsuario = req.params.id;

    let usuarioExiste = await Usuario.findByPk(idUsuario);

    if (!usuarioExiste) {
      res.status(422).json({ message: "Usuário não existe" });
      return;
    }

    res.status(200).json({ usuarioExiste });
  }

  //EDITA USUARIO
  static async editaUsuario(req, res) {
    //CHECA SE O USUÁRIO EXISTE PEGANDO O TOKEN
    const token = pegaToken(req);

    const usuario = await pegaUsuarioToken(token);

    let idparams = req.params.id;

    //MANOBRA QUE VISA EVITAR QUE O USUÁRIO PASSA UM ID DE OUTRA PESSOA
    if (idparams != usuario.idUsuario) {
      res.json({ message: "Acesso Negado!" });
      return;
    }

    //PASSA TODOS DADOS DO FORMULÁRIO
    let { nome, email, senha, confirmaSenha, telefone, imagem } = req.body;

    //UPLOADIMAGEM
    if (!imagem) {
      res
        .status(422)
        .json({ message: "O campo de imagem de perfil é obrigatório" });
      return;
    }

    //VALIDAÇÕES DE CAMPO DE EDIÇÃO DE FORMULÁRIO
    if (!nome) {
      res.status(422).json({ message: "O campo de nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O campo de e-mail é obrigatório" });
      return;
    }

    //CHECA SE O EMAIL JÁ EXISTE
    const emailExiste = await Usuario.findOne({ where: { email: email } });

    if (usuario.email !== email && emailExiste) {
      res
        .status(422)
        .json({ message: "E-mail já cadastrado, por favor use outro!" });

      return;
    }

    usuario.email = email;

    if (!telefone) {
      res.status(422).json({ message: "O campo de telefone é obrigatório" });
      return;
    }
    usuario.telefone = telefone;

    if (!senha) {
      res.status(422).json({ message: "Insira sua senha para proseguir com a atualização!" });
      return;
    }

    if (senha != confirmaSenha) {
      res
        .status(422)
        .json({ message: "Senha e confirma senha devem ser iguais!" });
      return;
    } else if (senha === confirmaSenha && senha != null) {
     
      var novaSenha;

      const salt = await bcrypt.genSalt(12);

      let passwordHash = await bcrypt.hash(senha, salt);

      usuario.senha = passwordHash;

      novaSenha = usuario.senha;
    }

    try {
      const usuario = {
        nome,
        email,
        senha: novaSenha,
        telefone,
        imagem,
      };

      //RETORMA DADOS ATUALIZADOS DO USUÁRIO
      await Usuario.update(usuario, { where: { idUsuario: idparams } });

      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
};
