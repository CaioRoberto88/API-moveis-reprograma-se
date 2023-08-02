//IMPORTANDO MODEL MOVEIS
const Movel = require("../models/Movel");

//const Usuario = require("../models/Usuario");

//HELPERS
const pegaToken = require("../helpers/pega-token");
const pegaUsuarioToken = require("../helpers/pega-usuario-token");

module.exports = class MoveisController {
  //CADASTRO
  static async cadastro(req, res) {
    let {
      nomeProduto,
      condicao,
      cor,
      descricao,
      preco,
      imagem,
      nomeVendedor,
      telefoneVendedor,
    } = req.body;

    let situacao = true;

    //TENTAR PEGAR O ID DO USUARIO AUTENTICADO
    //CHECA SE O USUÁRIO EXISTE PEGANDO O TOKEN
    const token = pegaToken(req);
    const usuario = await pegaUsuarioToken(token);

    let idUsuario = usuario.idUsuario;

    // CRIA OBJETO MOVEL
    const movel = {
      nomeProduto,
      condicao,
      cor,
      descricao,
      preco,
      situacao,
      imagem,
      nomeVendedor,
      telefoneVendedor,
      idUsuario,
    };

    //VALIDA CAMPOS
    if (!nomeProduto) {
      res.status(422).json({ message: "Campo nome do produto é obrigatório!" });
      return;
    }
    if (!condicao) {
      res.status(422).json({ message: "Campo condição é obrigatório!" });
      return;
    }
    if (!cor) {
      res.status(422).json({ message: "Campo cor é obrigatório!" });
      return;
    }
    if (!descricao) {
      res.status(422).json({ message: "Campo descrição é obrigatório!" });
      return;
    }
    if (!preco) {
      res.status(422).json({ message: "Campo preço é obrigatório!" });
      return;
    }

    if (!imagem) {
      res.status(422).json({ message: "Campo imagem é obrigatório!" });
      return;
    }

    if (!nomeVendedor) {
      res
        .status(422)
        .json({ message: "Campo nome do vendedor é obrigatório!" });
      return;
    }
    if (!telefoneVendedor) {
      res
        .status(422)
        .json({ message: "Campo telefone do vendedor é obrigatório!" });
      return;
    }

    await Movel.create(movel);

    res.status(200).json({ message: "Movel cadastrado com sucesso!" });
  }

  //ROTA PUBLICA MOSTRA TODOS OS MOVEIS DISPONÍVEIS A VENDA DOS USUARIOS.
  static async pegaTodosMoveis(req, res) {
    const moveis = await Movel.findAll();

    res.status(200).json({ moveis: moveis });
  }

  //PEGA TODOS OS MEUS MOVEIS DISPONIVEIS PRA VENDA
  static async pegaTodosMeusMoveis(req, res) {
    //PEGA TOKEN DO USUÁRIO
    const token = pegaToken(req);

    //PEGA TOKEN DO USUÁRIO PARA USAR COMO PARAMETRO PARA REGATE DOS MOVEIS INVIDUALMENTE
    let pegaMoveisUsuario = await pegaUsuarioToken(token);

    //==> novoUsuario = RECEBE O ID ATUAL DO USUÁRIO LOGADO NO SISTEMA POR MEIO DO TOKEN
    let novoValor = await pegaMoveisUsuario.idUsuario;

    const movel = await Movel.findAll({ where: { idUsuario: novoValor } });

    res.status(200).json({ movel });
  }

  //===================== PEGA TODOS MOVEIS QUE DESEJO COMPRAR ====================//
  static async pegaMoveisQueroComprar(req, res) {
    //PEGA TOKEN DO USUÁRIO
    const token = pegaToken(req);

    //PEGA TOKEN DO USUÁRIO PARA USAR COMO PARAMETRO PARA REGATE DOS MOVEIS INVIDUALMENTE
    let pegaMoveisUsuario = await pegaUsuarioToken(token);

    //==> novoUsuario = RECEBE O ID ATUAL DO USUÁRIO LOGADO NO SISTEMA POR MEIO DO TOKEN
    let novoValor = await pegaMoveisUsuario.idUsuario;

    const movel = await Movel.findAll({ where: { idUsuario: novoValor } });

    res.status(200).json({ movel });
  }

  //================ PEGA DETALHES DO MOVEL POR ID ================ //
  static async pegaMovelId(req, res) {
    const idMovel = req.params.id;

    //CHECA SE O MOVEL EXISTE
    const movel = await Movel.findOne({ where: { idMovel: idMovel } });

    if (!movel) {
      res.status(404).json({ message: "Movel não encontrado!" });
      return;
    }

    res.status(200).json({ movel: movel });
  }

  //================= ROTA DELETE MOVEL ================= //
  static async removeMovelId(req, res) {
    const idMovel = req.params.id;

    //CHECA SE O MOVEL EXISTE
    const movel = await Movel.findOne({ where: { idMovel: idMovel } });

    if (!movel) {
      res.status(404).json({ message: "Movel não encontrado!" });
      return;
    }

    //CHECA SE O USUÁRIO LOGADO REGISTROU O MOVEL, PARA EVITAR DE REMOVER O MOVEL DO OUTRO

    const token = pegaToken(req);
    const usuario = await pegaUsuarioToken(token);

    //CHECA O ID, PARA VER SER SÃO DIFERENTES, SE FOR CAI NO IF ABAIXO

    if (movel.idUsuario !== usuario.idUsuario) {
      res.status(422).json({
        message:
          "Houve um erro ao tentar processar a sua solicitação, tente novamente em outro momento!",
      });
      return;
    }

    await Movel.destroy({ where: { idMovel: idMovel } });

    res.status(200).json({ message: "Movel removido com sucesso!" });
  }

  //================= ATUALIZA MOVEL ================= //
  static async atualizaMovel(req, res) {
    const idMovel = req.params.id;

    let {
      nomeProduto,
      condicao,
      descricao,
      cor,
      preco,
      imagem,
      nomeVendedor,
      telefoneVendedor,
      situacao,
    } = req.body;

    const updatedData = {};

    //!===== CHECA SE O MOVEL EXISTE! =====//
    const movel = await Movel.findOne({ where: { idMovel: idMovel } });

    if (!movel) {
      res.status(404).json({ message: "Movel não encontrado!" });
      return;
    }

    //!===== CHECA SE O USUÁRIO LOGADO REGISTROU O MOVEL! =====//
    const token = pegaToken(req);
    const usuario = await pegaUsuarioToken(token);

    if (movel.idUsuario !== usuario.idUsuario) {
      res.status(422).json({
        message:
          "Houve um erro ao tentar processar a sua solicitação, tente novamente em outro momento!",
      });
      return;
    }

    //CAMPO DE VALIDAÇÃO DE EDIÇÃO DE FORMULÁRIO

    if (!nomeProduto) {
      res.status(422).json({ message: "Campo nome é obrigratório!" });
      return;
    } else {
      updatedData.nomeProduto = nomeProduto;
    }

    if (!condicao) {
      res.status(422).json({ message: "Campo condicao é obrigratório!" });
      return;
    } else {
      updatedData.condicao = condicao;
    }

    if (!descricao) {
      res.status(422).json({ message: "Campo descrição é obrigratório!" });
      return;
    } else {
      updatedData.descricao = descricao;
    }

    if (!cor) {
      res.status(422).json({ message: "Campo cor é obrigratório!" });
      return;
    } else {
      updatedData.cor = cor;
    }

    if (!preco) {
      res.status(422).json({ message: "Campo preço é obrigratório!" });
      return;
    } else {
      updatedData.preco = preco;
    }

    updatedData.imagem = imagem;

    if (!nomeVendedor) {
      res
        .status(422)
        .json({ message: "Campo nome do vendedor é obrigratório!" });
      return;
    } else {
      updatedData.nomeVendedor = nomeVendedor;
    }

    if (!telefoneVendedor) {
      res
        .status(422)
        .json({ message: "Campo telefone do vendedor é obrigratório!" });
      return;
    } else {
      updatedData.telefoneVendedor = telefoneVendedor;
    }

    await movel.update(updatedData);

    res.status(200).json({
      message:
        "Movel atualizado com sucesso! Foram atualizados os seguites dados:",
      dados: updatedData,
    });
  }

  //=========== ROTA DE MARCAR A COMPRAR DO MOVEL =========== //
  static async desejoComprar(req, res) {
    const idMovel = req.params.id;

    let {
      nomeProduto,
      condicao,
      descricao,
      cor,
      preco,
      imagem,
      situacao,
      nomeVendedor,
      telefoneVendedor,
      idComprador,
      nomeComprador,
      telefoneComprador,
    } = req.body;

    //CHECA SE O MOVEL EXISTE
    let movel = await Movel.findOne({ where: { idMovel: idMovel } });

    if (!movel) {
      res.status(404).json({ message: "Movel não encontrado!" });
      return;
    }

    //!===== CHECA SE O PROPRIO USUÁRIO TENTA COMPRAR O MOVEL QUE COLOCOU A VENDA! =====//
    const token = pegaToken(req);
    const usuario = await pegaUsuarioToken(token);

    if (movel.idUsuario == usuario.idUsuario) {
      res.status(422).json({
        message: "Você não pode comprar um movel que você mesmo registrou!",
      });

      return;
    }

    //CHECA SE O USUÁRIO JÁ MOSTROU INTERESSE DE COMPRAR O MOVEL

    if (movel.idComprador == usuario.idUsuario) {
      res.status(422).json({
        message: "Você já demostrou interesse de comprar este movel!",
      });

      return;
    }

    //ADICIONA O USUÁRIO COMO POSSÍVEL COMPRADOR DO MOVEL
    movel.comprador = {
      idComprador: usuario.idUsuario,
      nomeComprador: usuario.nome,
      telefoneComprador: usuario.telefone,
    };

    await Movel.update(movel.comprador, { where: { idMovel: idMovel } });

    res.status(200).json({
      message: `Pedido de compra enviado com sucesso, por favor espere o contato de ${movel.nomeVendedor}, pelo número ${movel.telefoneVendedor}`,
    });
  }

  //================= CANCELA VENDA ================= //

  static async cancelaVenda(req, res) {
    const idMovel = req.params.id;

    let {
      nomeProduto,
      condicao,
      descricao,
      cor,
      preco,
      imagem,
      idComprador,
      nomeVendedor,
      telefoneVendedor,
      situacao,
    } = req.body;

    const updatedData = {};

    //!===== CHECA SE O MOVEL EXISTE! =====//
    const movel = await Movel.findOne({ where: { idMovel: idMovel } });

    if (!movel) {
      res.status(404).json({ message: "Movel não encontrado!" });
      return;
    }

    //!===== CHECA SE O USUÁRIO LOGADO REGISTROU O MOVEL! =====//
    const token = pegaToken(req);
    const usuario = await pegaUsuarioToken(token);

    if (movel.idUsuario !== usuario.idUsuario) {
      res.status(422).json({
        message:
          "Houve um erro ao tentar processar a sua solicitação, tente novamente em outro momento!",
      });
      return;
    }

    //CAMPO DE VALIDAÇÃO DE EDIÇÃO DE FORMULÁRIO

    updatedData.nomeProduto = movel.nomeProduto;

    updatedData.condicao = movel.condicao;

    updatedData.descricao = movel.descricao;

    updatedData.cor = movel.cor;

    updatedData.preco = movel.preco;

    updatedData.imagem = movel.imagem;

    //CAMPO PARA CANCELAR VENDA

    idComprador = null;
    let nomeComprador = null;
    let telefoneComprador = null;

    updatedData.idComprador = idComprador;
    updatedData.nomeComprador = nomeComprador;
    updatedData.telefoneComprador = telefoneComprador;

    await movel.update(updatedData);

    res.status(200).json({
      message: "Venda cancelada com sucesso!",
      dados: updatedData,
    });
  }

  //CONCLUI A VENDA DO MOVEL
  static async compraConcluida(req, res) {
    const idMovel = req.params.id;

    //CHECA SE O MOVEL EXISTE
    let movel = await Movel.findOne({ where: { idMovel: idMovel } });

    if (!movel) {
      res.status(404).json({ message: "Movel não encontrado!" });
      return;
    }

    //!===== CHECA SE O USUÁRIO LOGADO REGISTROU O MOVEL! =====//
    const token = pegaToken(req);
    const usuario = await pegaUsuarioToken(token);

    if (movel.idUsuario !== usuario.idUsuario) {
      res.status(422).json({
        message:
          "Houve um erro ao tentar processar a sua solicitação, tente novamente em outro momento!",
      });
      return;
    }

    if (movel.situacao == false) {
      res.status(422).json({ message: "Você já vendeu este móvel!" });
      return;
    }

    movel.situacao = false;

    movel.vendedor = {
      situacao: movel.situacao,
    };

    await Movel.update(movel.vendedor, { where: { idMovel: idMovel } });

    res.status(200).json({
      message: "Parabéns! A venda do movel foi concluida com sucesso!",
    });
  }
};
