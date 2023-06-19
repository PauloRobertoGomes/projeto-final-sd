const express = require("express");
const mongoose = require("mongoose");
const uri = "mongodb://mongo:27017/sd";
const port = 8080;
const app = express();
const routes = express.Router();

//Configuração para tratamento dos dados vindo via api
app.use(express.json());

//Banco de dados

//Criação do esquema/estrutura do usuário
const userSchema = new mongoose.Schema({
  nome: {
    required: true,
    type: String,
  },
  ativo: {
    required: true,
    type: Boolean,
  },
  id: {
    required: true,
    type: Number,
  },
});

//Criação do model do usuário baseado no esquema montado acima
const userModel = mongoose.model("Data", userSchema);

//Conexão com o bd
mongoose.connect(uri);
const database = mongoose.connection;

//Verifica se tiver erros
database.on("error", (error) => {
  console.log(error);
});

//Indica quando é conectada
database.once("connected", () => {
  console.log("Database Connected");
});

//API

//Listar todos os usuários
routes.get("/", async (req, res) => {
  try {
    const data = await userModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Pega usuário pelo id
routes.get("/:id", async (req, res) => {
  try {
    const data = await userModel.findOne({ id: req.params.id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Criar um novo usuário
routes.post("/", async (req, res) => {
  console.log(req.body);
  const data = new userModel({
    nome: req.body.nome,
    ativo: req.body.ativo,
    id: req.body.id,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Atualizar informações pelo id
routes.put("/:id", async (req, res) => {
  try {
    await userModel.findOneAndUpdate({ id: req.params.id }, req.body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Deletar usuário pelo id
routes.delete("/:id", async (req, res) => {
  try {
    await userModel.findOneAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Concatenação das rotas com a url base
app.use("/api/v1/user/", routes);

//Inicialização do server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
