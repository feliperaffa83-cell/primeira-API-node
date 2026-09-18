
const form = document.getElementById("formCadastro");
const respostaDiv = document.getElementById("resposta");
const usuariosList = document.getElementById("usuarios");

console.log(form);
console.log(respostaDiv);
console.log(usuariosList);

        // 'addEventListener' fica observando o elemento e espera um evento acontacer(que no caso é o 'submit' = Quando o usuário enviar o formulário, execute esse código), o 'async'permite o uso do 'await' que faz a requisição ao servidor e espera a resposta.
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Impede a página de recarregar ao enviar, não permito o padrão do formulario.

            // Monta o objeto cahamdo dados(JSON) com os valores dos campos do formulário, que serão enviados para a API.
            const dados = {
                nome: document.getElementById("nome").value,
                idade: Number(document.getElementById("idade").value),
                sexo: document.getElementById("sexo").value,
                cpf: document.getElementById("cpf").value,
                moradia: document.getElementById("moradia").value,
                estado_civil: document.getElementById("estado_civil").value
            };

            // o try/catch é usado para capturar erros que possam ocorrer durante a requisição, como problemas de conexão com o servidor. O try tenta executar o código dentro dele, e se ocorrer algum erro, o catch captura esse erro e permite que você lide com ele de forma adequada.
            try {
                // Faz a requisição POST para a API em Node.js utilizando a função fetch, que envia os dados do formulário para o servidor. O 'await' faz com que o código espere a resposta do servidor antes de continuar.
                const response = await fetch("http://localhost:3000/cadastro", {
                    method: "POST", //Informa que será feio uma requisição POST

                    headers: { //Informa ao servidor que os dados estão no formato JSON
                        "Content-Type": "application/json"
                    },

                    // transforma o objeto dados em uma string JSON
                    body: JSON.stringify(dados)
                });
                // espera a resposta da API e transforma a resposta em um objeto JavaScript.
                const result = await response.json();

                if (response.ok) {
                    respostaDiv.style.color = "green";
                    respostaDiv.innerHTML = `<p>${result.mensagem}</p>`;
                    form.reset(); // Limpa os campos do formulário
                    carregarCadastros();
                } else {
                    respostaDiv.style.color = "red";
                    respostaDiv.innerHTML = `<p>Erro: ${result.erro}</p>`;
                }
                // o 'catch' só ocorre se houver um erro na comunicação com o servidor
            } catch (error) {
                respostaDiv.style.color = "red";
                respostaDiv.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
            }
        });   

        // Função 'async', permitie usar o 'awiat' que pede uma requisição para o servidor e espera uma resposta
            async function carregarCadastros() {
                try {
                const response = await fetch("http://localhost:3000/cadastro"); // faz a requisisção para a API pela função 'fetch' e o 'await' faz esperar pela resposta do servidor antes de continuar
        
                const result = await response.json();// tranforma a resposta em JSON.

                //Atualiza o elemento do HTML com 'vazio' limpando a lista antes de criar um novo elemento.
                usuariosList.innerHTML = "";

                // Percorre a lista com um 'forEach'
                result.forEach(usuario => {
                    usuariosList.innerHTML += ` 
                        <p>
                            ID: ${usuario.id} |
                            Nome: ${usuario.nome} |
                            Idade: ${usuario.idade} |
                            Sexo: ${usuario.sexo} |
                            CPF: ${usuario.cpf} |
                            Moradia: ${usuario.moradia} |
                            Estado_Civil: ${usuario.estado_civil} |
                            Ações: ${usuario.acoes};
                        </p>
                    `;
                });
                // o 'catch' só ocorre se houver um erro na comunicação com o servidor
                } catch (error) {
                    respostaDiv.style.color = "red";
                    usuariosList.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
                }
            }
            carregarCadastros();
