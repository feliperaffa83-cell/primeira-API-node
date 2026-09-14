
const express = require("express"); //'require()', função integrada para carregar e importar módulos
// Importa o módulo (Express) e coloque dentro da variável express.

/*const { helloworld } = require("./helloworld"); //Estou importando a função*/

const app = express();
// Executa a função express() e cria uma instância da aplicação Express, armazenada na variável app.

const PORT = 3000;
// Define a porta do servidor

const cors = require("cors");
// Importa o pacote CORS

app.use(cors());
// Habilita requisições de outras origens (Front-end)

app.use(express.json());
// Função middleware usada para "traduzir" dados recebidos em formato JSON, permite usar o método POST.

/* app.get("/", (req, res) => {
    res.send(helloworld());
   });
 Usa o método GET para fazer uma requisição, o primeiro parâmetro é a rota ("/") representando a URL inicial da requisição, o segundo é uma função de callback(Uma função callback é uma função passada como argumento para outra função, para ser executada posteriormente em determinada situação. No caso do app.get(), ela é executada quando chega uma requisição GET para a rota /.) que recebe dois parâmetros: req (request) e res (response). A função envia a resposta "Hello World" para o cliente pelo método 'send()'.*/

 //Cria a rota POST
 app.post("/cadastro", (req, res) =>{

    //A sintxe '{ ... } = req.body:' se chama desestruturação, cris um "pacote" com variáveis separadas para o 'req.body' que contém os dados enviados pelo cliente
    const {nome, idade, sexo, cpf, moradia, estado_civil} = req.body;

    //Verificação de segurança, para ver se vieram os dadso corretamente, o "!" significa 'Se Não exitir'
    if (!nome || !cpf) {
        // O return para o código e não executa. O número 400 = bad request.
        return res.status(400).json({erro: "Nome e CPF são obrigatórios!"});
    }




    //Confirmando o sucesso, o código 201 = Created(criado), após isso usamos o '.json()' para mostrar uma mensagem de sucesso e os dados recebidos para tranformar de volta em JSON e mandar para a tela do Hoppscotch
    res.status(201).json({
        mensagem: "Cadastr realizado com sucesso!",
        dados_salvos: {
            nome,
            idade,
            sexo,
            cpf,
            moradia,
            estado_civil
        }
    });
 });

 
// Usa o 
app.listen(PORT, ()=> {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// 'app.listen()' é uma função de escuta, que serve para iniciar um servidor back-end. O 'console.log' exibe uma menasagem no terminal quando executarmos o comando 'node server.js'.