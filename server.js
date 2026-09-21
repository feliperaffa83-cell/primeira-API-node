
const express = require("express"); //'require()', função integrada para carregar e importar módulos
// Importa o módulo (Express) e coloque dentro da variável express.


const cors = require("cors");
// Importa o pacote CORS


const db = require("./banco");


const app = express();
// Executa a função express() e cria uma instância da aplicação Express, armazenada na variável app.


const PORT = 3000;
// Define a porta do servidor


app.use(cors());
// Habilita requisições de outras origens (Front-end)
app.use(express.json());
// Função middleware usada para "traduzir" dados recebidos em formato JSON, permite usar o método POST.
//Rota principa.
app.use(express.urlencoded({ extended: true }));


 app.get("/", (_req, res) => {
    res.send("Servidor funcionando!");
   });
 /*Usa o método GET para fazer uma requisição, o primeiro parâmetro é a rota ("/") representando a URL inicial da requisição, o segundo é uma função de callback(Uma função callback é uma função passada como argumento para outra função, para ser executada posteriormente em determinada situação. No caso do app.get(), ela é executada quando chega uma requisição GET para a rota /.) que recebe dois parâmetros: req (request) e res (response). A função envia a resposta "Servidor funcionando!" para o cliente pelo método 'send()'.*/


 //Cria a rota POST, para cadastrar uma pessoa
 app.post("/cadastro", (req, res) =>{
    console.log("Método:", req.method);
    console.log("URL:", req.url);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body recebido:", req.body);

    //A sintxe '{ ... } = req.body:' se chama desestruturação, cris um "pacote" com variáveis separadas para o 'req.body' que contém os dados enviados pelo cliente
    const {nome, idade, sexo, cpf, moradia, estado_civil} = req.body || {};

    //Verificação de segurança, para ver se vieram os dadso corretamente, o "!" significa 'Se Não exitir'
    if (!nome || !cpf) {
        // O return para o código e não executa. O número 400 = bad request.
        return res.status(400).json({erro: "Nome e CPF são obrigatórios!"});
    }


    // Comando SQL para inserir os dados
    const comando = db.prepare(`
            INSERT INTO cadastros (
            nome,
            idade,
            sexo,
            cpf,
            moradia,
            estado_civil
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);

    //Executa o INSERT
    const resultado = comando.run(
          nome,
          idade,
          sexo,
          cpf,
          moradia,
          estado_civil
        ); 


    //Confirmando o sucesso, o código 201 = Created(criado), após isso usamos o '.json()' para mostrar uma mensagem de sucesso e os dados recebidos para tranformar de volta em JSON e mandar para o cliente
    res.status(201).json({
        mensagem: "Cadastr realizado com sucesso!",
        id: resultado.lastInsertRowid,
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

 
// Rota GET para listar todos os cadastros
app.get("/cadastro", (_req, res) => {
    const cadastros = db.prepare(`
        SELECT * FROM cadastros
   `).all(); // Retorna vários registros

   res.json(cadastros); // Sem .all(), o SQLite apenas prepara a consulta. Com .all(), ele executa o SELECT e retorna os registros.
});

// Rota GET para buscar um cadastro pelo ID
app.get("/cadastro/:id", (req, res) => {
    // Obtém o ID da URL
    const id = Number(req.params.id); 
    // Converte o parâmetro de string para número
    
    // Consulta no banco de dados pelo ID
    const cadastro = db.prepare(` 
        SELECT * FROM cadastros
        WHERE id = ?
        `).get(id); // Retorna um único registro, pois o ID é único para cada cadastro.

        // Verifica  se o cadastro foi encontrado
        if (!cadastro) {
            return res.status(404).json({erro: "Cadastro não encontrado!"});
        }
        // Retorna o cadastro encontrado em formato JSON
    res.json(cadastro);
});

//Rota DELETE para excluir um usuário pelo ID
app.delete("/cadastro/:id", (req, res) =>{
     // Consulta no banco de dados pelo ID
    const id = Number(req.params.id);
    // Prepara o comnado SLQ
    const cadastro = db.prepare(` 
        DELETE FROM cadastros
        WHERE id = ?
        `).run(id); // Executa o DELETE com o id encontrado

        /* Verifica  se o cadastro foi encontrado 
        'cadastro.changes' é uma propriedade do SQLite, que informa quantas linhas foram alteradas no banco
        */
        if (!cadastro.changes) {
            return res.status(404).json({erro: "Cadastro não encontrado!"});
        }
        // Retorna o cadastro encontrado em formato JSON
    res.json({
        mensagem: "Cadastro excluído com sucesso!"
    });
        
});

//Rota para atualizar cadastro
app.put("/cadastro/:id", (req, res) =>{
    const id = Number(req.params.id);
    const {nome, idade, sexo, cpf, moradia, estado_civil} = req.body || {};
    const cadastro = db.prepare(`
        SELECT * FROM cadastros
        WHERE id = ?
        `).get(id);

        //Verifica se o cadastro existe
        if(!cadastro){
            return res.status(404).json({erro: "Cadastro não encontrado!"});
        }
        // Prespara as atualizações 
        const resultado = db.prepare(`
        UPDATE cadastros
        SET
           nome = ?,
           idade = ?,
           sexo = ?,
           cpf = ?,
           moradia = ?,
           estado_civil = ?
        WHERE id = ?
         `).run(nome, idade, sexo, cpf, moradia, estado_civil, id); // Executa os novos valores do UPDATE para o id respectivo
        
         //Verifica se o UPDATE alterou  alguma linha no banco
         if(!resultado.changes){
            return res.status(404).json({
                erro: "Nenhum cadastro foi atualizado!"
            });
         };

         res.json({
        mensagem: "Cadastro atualizado com sucesso!"
    });
});

/*O 'app.listen' começa o servidor e espera requisições(no caso a PORT = 3000 "meu servidor") e executa a arrow function 
que mostra no console que o servidor iniciou na porta 3000 */
app.listen(PORT, ()=> {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// 'app.listen()' é uma função de escuta, que serve para iniciar um servidor back-end. O 'console.log' exibe uma menasagem no terminal quando executarmos o comando 'node server.js'.