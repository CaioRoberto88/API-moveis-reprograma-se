const multer = require("multer");

const path = require("path");

//DESTINAÇÃO DO ARMAZENAMENTO DAS IMAGENS
const imagemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "usuarios";

    if (req.baseUrl.includes("usuarios")) {
      folder = "usuarios";
    } else if (req.baseUrl.includes("moveis")) {
      folder = "moveis";
    }

    cb(null, `public/img/${folder}`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadImagem = multer({
  storage: imagemStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb((new Error("Por favor, envie apenas jpg ou png!")));
    }
    cb(null, true);
  },
});

module.exports = { uploadImagem };
