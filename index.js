
const form = document.getElementById("formCadastro");
const respostaDiv = document.getElementById("resposta");

        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Impede a página de recarregar ao enviar

            // Monta o objeto JSON igual ao enviado pelo Hoppscotch
            const dados = {
                nome: document.getElementById("nome").value,
                idade: document.getElementById("idade").value,
                sexo: document.getElementById("sexo").value,
                cpf: document.getElementById("cpf").value,
                moradia: document.getElementById("moradia").value,
                estado_civil: document.getElementById("estado_civil").value
            };

            try {
                // Faz a requisição POST para a API em Node.js
                const response = await fetch("http://localhost:3000/cadastro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const result = await response.json();

                if (response.ok) {
                    respostaDiv.style.color = "green";
                    respostaDiv.innerHTML = `<p>${result.mensagem}</p>`;
                    form.reset(); // Limpa os campos do formulário
                } else {
                    respostaDiv.style.color = "red";
                    respostaDiv.innerHTML = `<p>Erro: ${result.erro}</p>`;
                }
            } catch (error) {
                respostaDiv.style.color = "red";
                respostaDiv.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
            }
        });