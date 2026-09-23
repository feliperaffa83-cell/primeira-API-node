
const form = document.getElementById("formCadastro");
const respostaDiv = document.getElementById("resposta");
const usuariosList = document.getElementById("usuarios");
let idEditando = null;

console.log(form);
console.log(respostaDiv);
console.log(usuariosList);

        // 'addEventListener' fica observando o elemento e espera um evento acontacer(que no caso é o 'submit' = Quando o usuário enviar o formulário, execute esse código), o 'async'permite o uso do 'await' que faz a requisição ao servidor e espera a resposta.
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Impede a página de recarregar ao enviar, não permito o padrão do formulario.
            console.log("Sumit executado");
            // Monta o objeto cahamdo dados(JSON) com os valores dos campos do formulário, que serão enviados para a API.
            const dados = {
                nome: document.getElementById("nome").value,
                idade: Number(document.getElementById("idade").value),
                sexo: document.getElementById("sexo").value,
                cpf: document.getElementById("cpf").value,
                moradia: document.getElementById("moradia").value,
                estado_civil: document.getElementById("estado_civil").value
            };
                        //Verifica se um cadastro está sendo editado
                        if (idEditando !== null) {
                            const response = await fetch(`http://localhost:3000/cadastro/${idEditando}`, {
                            method: "PUT", //Informa que será feio uma requisição PUT

                            headers: { //Informa ao servidor que os dados estão no formato JSON
                            "Content-Type": "application/json"
                            },

                            // transforma o objeto dados em uma string JSON e envia novos valores
                            body: JSON.stringify(dados)
                            });

                            const result = await response.json() // Pega a resposta retornada da API

                            //Chama a função abaixo para atualizar a tabela
                            carregarCadastros();

                            //Mensagem de sucesso
                            respostaDiv.style.color = "green";
                            respostaDiv.innerHTML = `<p>${result.mensagem}</p>`;

                            // Tira o fomulario do modo de edição, não tem nenhum id para editar
                            idEditando = null;

                            //Volta o botão para Enviar Cadastro
                            document.getElementById("botEnv").textContent = "Enviar Cadastro";

                            }else {
                            const response = await fetch("http://localhost:3000/cadastro", {
                            method: "POST", //Informa que será feio uma requisição POST

                            headers: { //Informa ao servidor que os dados estão no formato JSON
                            "Content-Type": "application/json"
                            },

                            // transforma o objeto dados em uma string JSON
                            body: JSON.stringify(dados)
                            });
                            // espera a resposta da API e transforma a resposta em um objeto JavaScript.
                            const result = await response.json()

                             if (response.ok) {
                            respostaDiv.style.color = "green";
                            respostaDiv.innerHTML = `<p>${result.mensagem}</p>`;
                            carregarCadastros();
                            } else {
                            respostaDiv.style.color = "red";
                            respostaDiv.innerHTML = `<p>Erro: ${result.erro}</p>`;
                            }  
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
                        <tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nome}</td>
                            <td>${usuario.idade}</td>
                            <td>${usuario.sexo}</td>
                            <td>${usuario.cpf}</td>
                            <td>${usuario.moradia}</td>
                            <td>${usuario.estado_civil}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm" onclick="editarCadastro(${usuario.id})">Editar</button>
                                <button type="button" class="btn btn-danger btn-sm" onclick = "deletarCadastro(${usuario.id})">Excluir</button>
                            </td> 
                        </tr>
                    `;
                });
                // o 'catch' só ocorre se houver um erro na comunicação com o servidor
                } catch (error) {
                    respostaDiv.style.color = "red";
                    usuariosList.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
                }
            }
            carregarCadastros();
            

             async function deletarCadastro(id) {
                if(!confirm("Tem certeza que deseja excluir este cadastro?")) {
                    return; //Retorna e não executa o código abaixo se o usuário clicar em "Cancelar"
                }
                    try {
                        // Faz a requisição DELETE para a API em Node.js utilizando a função fetch, que envia o id do cadastro para o servidor. O 'await' faz com que o código espere a resposta do servidor antes de continuar.
                        const response = await fetch(`http://localhost:3000/cadastro/${id}`, {
                            method: "DELETE"
                        });

                        const result = await response.json();// tranforma a resposta em JSON.
                    
                        // Atualiza a lista de cadastros após a exclusão se caso a requisição for bem sucedida, caso contrário exibe uma mensagem de erro.
                        if (response.ok) {
                        respostaDiv.style.color = "green";
                        respostaDiv.innerHTML = `<p>${result.mensagem}</p>`;
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
                }

                

                async function editarCadastro(id) {
                    idEditando = id; // Armazena o ID 
                    try {
                        // 'response' é um objeto que recebe a resposta do servidor
                         const response = await fetch(`http://localhost:3000/cadastro/${id}`, {
                            method: "GET"
                        });

                        // pega a resposta do objeto 'response', transforma em JSON e armazena na variável cadastro
                        const cadastro = await response.json();

                        // pegamos os elemnteos pelo id no HTML e atribuimos um nova valor para esse campo vindo da resposta aramazenada na variável cadastro
                        document.getElementById("nome").value = cadastro.nome;
                        document.getElementById("idade").value = cadastro.idade;
                        document.getElementById("sexo").value = cadastro.sexo;
                        document.getElementById("cpf").value = cadastro.cpf;
                        document.getElementById("moradia").value = cadastro.moradia;
                        document.getElementById("estado_civil").value = cadastro.estado_civil;
                        
                        document.getElementById("botEnv").textContent = "Salvar Alterações";

                    } catch (error) {
                      respostaDiv.style.color = "red";
                      respostaDiv.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
                    }
                }

                       