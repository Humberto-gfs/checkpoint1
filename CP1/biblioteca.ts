
const formCadastroLivro = document.getElementById("formCadastroLivro") as HTMLFormElement;
const tabelaLivro = document.getElementById("tbLivros") as HTMLTableSectionElement;
const titulo = document.getElementById("titulo") as HTMLInputElement;
const autor = document.getElementById("autor") as HTMLInputElement;
const paginas = document.getElementById("paginas") as HTMLInputElement;
const genero = document.getElementById("genero") as HTMLInputElement;
const buscaAutor = document.getElementById("buscaAutor") as HTMLInputElement;
const resultadoBusca = document.getElementById("resultadoBusca") as HTMLDivElement;


interface Livro {
    id: number;
    titulo: string;
    autor: string;
    paginas: number;
    genero: string;
}


let livros: Livro[] = JSON.parse(localStorage.getItem("livros") || "[]");

// FUNÇÃO PARA ATUALIZAR A TABELA
function atualizarTabela(): void {
    tabelaLivro.innerHTML = "";
    livros.forEach((livro) => {
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

// FUNÇÃO PARA SALVAR NO LOCAL STORAGE
function salvarLocalStorage(): void {
    localStorage.setItem("livros", JSON.stringify(livros));
}

// FUNÇÃO PARA CADASTRAR LIVRO
function cadastrarLivro(event: Event): void {
    event.preventDefault();

    const novoLivro: Livro = {
        id: Date.now(),
        titulo: titulo.value,
        autor: autor.value,
        paginas: Number(paginas.value),
        genero: genero.value,
    };

    livros.push(novoLivro);
    salvarLocalStorage();
    atualizarTabela();


    titulo.value = "";
    autor.value = "";
    paginas.value = "";
    genero.value = "";
}

//FUNÇÃO PARA BUSCAR LIVROS POR AUTOR
function buscarPorAutor(): void {
    const autorBusca = buscaAutor.value.toLowerCase();


    const livrosFiltrados = livros.filter((livro) =>
        livro.autor.toLowerCase().includes(autorBusca)
    );


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

//FUNÇÃO PARA EDITAR LIVRO
function editLivro(id: number): void {
    const livro = livros.find((l) => l.id === id);
    if (!livro) return;


    titulo.value = livro.titulo;
    autor.value = livro.autor;
    paginas.value = String(livro.paginas);
    genero.value = livro.genero;


    livros = livros.filter((l) => l.id !== id);
    salvarLocalStorage();
    atualizarTabela();
}

//FUNÇÃO PARA EXCLUIR LIVRO
function deleteLivro(id: number): void {
    livros = livros.filter((l) => l.id !== id);
    salvarLocalStorage();
    atualizarTabela();
}


formCadastroLivro.addEventListener("submit", cadastrarLivro);

window.addEventListener("load", atualizarTabela);


(window as any).editLivro = editLivro;
(window as any).deleteLivro = deleteLivro;
(window as any).buscarPorAutor = buscarPorAutor;