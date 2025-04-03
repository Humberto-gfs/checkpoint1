// Seleção de elementos
var formCadastroLivro = document.getElementById("formCadastroLivro");
var tabelaLivro = document.getElementById("tbLivros");

// Recupera os livros do localStorage ou inicializa como um array vazio
var livros = JSON.parse(localStorage.getItem("livros") || "[]");

var titulo = document.getElementById("titulo");
var autor = document.getElementById("autor");
var paginas = document.getElementById("paginas");
var genero = document.getElementById("genero");

// FUNÇÃO PARA ATUALIZAR A TABELA
function atualizarTabela() {
    tabelaLivro.innerHTML = ""; // Limpa o conteúdo atual da tabela
    livros.forEach(function (livro) {
        tabelaLivro.innerHTML += `
            <tr>
                <td>${livro.autor}</td>
                <td>${livro.genero}</td>
                <td>${livro.paginas}</td>
                <td>${livro.titulo}</td>
                <td>
                    <button class="btn btn-primary" onclick="editLivro(${livro.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteLivro(${livro.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function buscarPorAutor() {
    var autorBusca = document.getElementById("buscaAutor").value.toLowerCase();
    var resultadoBusca = document.getElementById("resultadoBusca");

    // Filtra os livros pelo autor
    var livrosFiltrados = livros.filter(function (livro) {
        return livro.autor.toLowerCase().includes(autorBusca);
    });

    // Exibe os resultados
    if (livrosFiltrados.length > 0) {
        resultadoBusca.innerHTML = "<h3>Resultados da Busca:</h3>";
        resultadoBusca.innerHTML += `
            <table border="1">
                <thead>
                    <tr>
                        <th>Autor</th>
                        <th>Gênero</th>
                        <th>Páginas</th>
                        <th>Título</th>
                    </tr>
                </thead>
                <tbody>
                    ${livrosFiltrados
                .map(
                    (livro) => `
                        <tr>
                            <td>${livro.autor}</td>
                            <td>${livro.genero}</td>
                            <td>${livro.paginas}</td>
                            <td>${livro.titulo}</td>
                        </tr>
                    `
                )
                .join("")}
                </tbody>
            </table>
        `;
    } else {
        resultadoBusca.innerHTML = "<p>Nenhum livro encontrado para o autor informado.</p>";
    }
}

// FUNÇÃO PARA SALVAR NO LOCAL STORAGE
function salvarLocalStorage() {
    localStorage.setItem("livros", JSON.stringify(livros));
}

// FUNÇÃO PARA CADASTRAR LIVRO
function cadastrarLivro(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    var novoLivro = {
        id: Date.now(),
        titulo: titulo.value,
        autor: autor.value,
        paginas: Number(paginas.value),
        genero: genero.value,
    };

    livros.push(novoLivro); // Adiciona o novo livro ao array
    salvarLocalStorage(); // Salva o array de livros no localStorage
    atualizarTabela(); // Atualiza a tabela na interface

    // Limpa os campos do formulário
    titulo.value = "";
    autor.value = "";
    paginas.value = "";
    genero.value = "";
}

// FUNÇÃO PARA EDITAR LIVRO
function editLivro(id) {
    var livro = livros.find(function (l) {
        return l.id === id;
    });
    if (!livro) return;

    // Preenche os campos do formulário com os dados do livro
    titulo.value = livro.titulo;
    autor.value = livro.autor;
    paginas.value = String(livro.paginas);
    genero.value = livro.genero;

    // Remove o livro da lista para evitar duplicação ao salvar
    livros = livros.filter(function (l) {
        return l.id !== id;
    });
    salvarLocalStorage();
    atualizarTabela();
}

// FUNÇÃO PARA EXCLUIR LIVRO
function deleteLivro(id) {
    livros = livros.filter(function (l) {
        return l.id !== id;
    }); // Filtra o livro que será removido
    salvarLocalStorage(); // Atualiza o localStorage
    atualizarTabela(); // Atualiza a tabela na interface
}

// Adiciona o evento de submissão ao formulário
formCadastroLivro.addEventListener("submit", cadastrarLivro);

// Carrega a tabela de livros ao carregar a página
window.addEventListener("load", atualizarTabela);

// Expondo funções ao escopo global
window.editLivro = editLivro;
window.deleteLivro = deleteLivro;