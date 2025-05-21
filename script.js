// Seletores de filtro (com verificação)
const generoFiltro = document.getElementById("filtro-genero");
const statusFiltro = document.getElementById("filtro-disponibilidade");
const livros = document.querySelectorAll(".livro");

// Função de filtro de livros
function filtrarLivros() {
  if (!generoFiltro || !statusFiltro) return;

  const genero = generoFiltro.value;
  const status = statusFiltro.value;

  livros.forEach(livro => {
    const generoLivro = livro.getAttribute("data-genero");
    const statusLivro = livro.getAttribute("data-status");

    const generoMatch = genero === "todos" || genero === generoLivro;
    const statusMatch = status === "todos" || status === statusLivro;

    livro.style.display = (generoMatch && statusMatch) ? "flex" : "none";
  });
}

// Só adiciona os eventos se os filtros existem
if (generoFiltro) generoFiltro.addEventListener("change", filtrarLivros);
if (statusFiltro) statusFiltro.addEventListener("change", filtrarLivros);


const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modal-titulo");
const modalAutor = document.getElementById("modal-autor");
const modalImagem = document.getElementById("modal-imagem");

document.querySelectorAll(".livro").forEach(livro => {
  livro.addEventListener("click", () => {
    const titulo = livro.querySelector(".titulo")?.textContent || "";
    const autor = livro.querySelector(".autor")?.textContent || "";
    const imagem = livro.querySelector("img")?.src || "";
    const genero = livro.getAttribute("data-genero") || "Desconhecido";
    const status = livro.getAttribute("data-status") || "Desconhecido";

    const livroSelecionado = { titulo, autor, imagem, genero, status };
    sessionStorage.setItem("livroSelecionado", JSON.stringify(livroSelecionado));

    window.location.href = "detalhes.html";
  });
});

// Texto animado
document.addEventListener("DOMContentLoaded", function () {
  const text = "Descubra um mundo de conhecimento";
  const typingElement = document.getElementById("typing");
  let index = 0;

  if (typingElement) {
    function type() {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 70);
      }
    }
    type();
  }
});

// Preview da imagem
const inputImagem = document.querySelector('input[type="file"]');
const previewImg = document.getElementById('preview');

if (inputImagem && previewImg) {
  inputImagem.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      previewImg.style.display = "block";
      previewImg.src = URL.createObjectURL(file);
    } else {
      previewImg.style.display = "none";
      previewImg.src = "#";
    }
  });
}

document.getElementById('isbn').addEventListener('input', function() {
  const isbn = this.value.trim();
  const statusText = document.getElementById('status-isbn');
  
  // Verificar se o ISBN tem 13 dígitos
  if (isbn.length === 13) {
    // Exibir a mensagem de carregamento
    statusText.style.display = 'block';
    statusText.textContent = 'Carregando ISBN...';

    // Realizar a requisição para a API
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Depuração: Verificar a resposta da API
        
        if (data.items && data.items.length > 0) {
          const livro = data.items[0].volumeInfo;

          // Preencher os campos com as informações do livro
          document.getElementById('titulo').value = livro.title || 'Título não encontrado';
          document.getElementById('autor').value = livro.authors ? livro.authors.join(', ') : 'Autor não encontrado';
          document.getElementById('genero').value = livro.categories ? livro.categories.join(', ') : 'Gênero não encontrado';
          
          // Corrigir o preenchimento do ano
          const ano = livro.publishedDate ? livro.publishedDate.split('-')[0] : 'Ano não encontrado';
          document.getElementById('ano').value = ano;
          
          // Puxar a imagem do livro
          const livroImagem = livro.imageLinks ? livro.imageLinks.thumbnail : '';
          console.log('Imagem URL:', livroImagem); // Verificar o URL da imagem

          // Se a imagem for encontrada, exibir o preview
          if (livroImagem) {
            definirImagemLivro(livroImagem);
          } else {
            document.getElementById('livro-imagem').style.display = 'none'; // Esconder se não houver imagem
          }

          // Mostrar a mensagem de "Concluído!"
          statusText.textContent = 'Concluído!';
        } else {
          console.log('Livro não encontrado'); // Depuração
          alert('Livro não encontrado');
          statusText.style.display = 'none'; // Esconde o status caso não encontre
        }
      })
      .catch(err => {
        console.error('Erro ao buscar o livro:', err); // Depuração de erros
        alert('Erro ao buscar informações do livro');
        statusText.style.display = 'none'; // Esconde o status em caso de erro
      });
  }
});
// Lidar com o carregamento manual de imagens
document.getElementById('input-imagem').addEventListener('change', function() {
  const file = this.files[0];
  const previewDiv = document.getElementById('imagem-preview');

  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Mostrar o preview da imagem carregada
      previewDiv.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; margin-top: 10px;" />`;
    };
    
    reader.readAsDataURL(file);
  } else {
    previewDiv.innerHTML = ''; // Limpar o preview se nenhuma imagem for selecionada
  }
});
// Botões e elementos
const livroImagem = document.getElementById('livro-imagem');
const removerImagemBtn = document.getElementById('remover-imagem');

const inputImagemManual = document.getElementById('input-imagem');
const previewDiv = document.getElementById('imagem-preview');
const removerPreviewBtn = document.getElementById('remover-preview');



// Função para exibir imagem via ISBN
function definirImagemLivro(url) {
  livroImagem.src = url;
  livroImagem.style.display = 'block';
  removerImagemBtn.style.display = 'inline-block';
}

// Remover imagem via ISBN
removerImagemBtn.addEventListener('click', () => {
  livroImagem.src = '';
  livroImagem.style.display = 'none';
  removerImagemBtn.style.display = 'none';
});

// Carregamento de imagem manual
inputImagemManual.addEventListener('change', function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewDiv.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; margin-top: 10px;" />`;
      removerPreviewBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  } else {
    previewDiv.innerHTML = '';
    removerPreviewBtn.style.display = 'none';
  }
});

// Remover imagem manual
removerPreviewBtn.addEventListener('click', () => {
  previewDiv.innerHTML = '';
  inputImagemManual.value = ''; // limpa o input file
  removerPreviewBtn.style.display = 'none';
});


document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("smartlib_usuario"));
  const userInfo = document.getElementById("user-info");

  if (usuario && userInfo) {
    const fotoSalva = localStorage.getItem("smartlib_fotoPerfil");

    userInfo.innerHTML = `
        <img src="${fotoSalva || "https://i.pravatar.cc/150?u=" + usuario.usuario}" alt="Foto do usuário" id="foto-perfil" />
        <span>${usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}</span>
        <div class="menu-dropdown" id="menu-dropdown">
          <button onclick="logout()">🚪 Sair</button>
          <label style="font-size: 0.9em; color: gray;">📷 Mudar Foto
            <input type="file" id="input-foto-perfil" accept="image/*" style="display: none;">
          </label>
        </div>
      `;

    // Toggle do menu
    userInfo.addEventListener("click", () => {
      const menu = document.getElementById("menu-dropdown");
      menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

    // Upload de nova imagem
    document.getElementById("input-foto-perfil").addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (event) {
        const url = event.target.result;
        localStorage.setItem("smartlib_fotoPerfil", url);
        document.getElementById("foto-perfil").src = url;
      };
      reader.readAsDataURL(file);
    });
  }
});

function logout() {
  localStorage.removeItem("smartlib_usuario");
  window.location.href = "login.html";
}

// script.js

// Só roda na tela de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Exemplo de usuários fixos
    const usuariosFixos = [
      { usuario: 'cliente',    senha: 'cliente123',    tipo: 'cliente'    },
      { usuario: 'funcionario', senha: 'funcionario123', tipo: 'funcionario' }
    ];

    // Usuários cadastrados no localStorage
    const cadastrados = JSON.parse(localStorage.getItem('smartlib_usuarios')) || [];

    // Junta tudo
    const todos = usuariosFixos.concat(cadastrados);

    // Valida
    const user = todos.find(u => u.usuario === username && u.senha === password);
    if (!user) {
      alert('Usuário ou senha inválidos.');
      return;
    }

    // **DEBUG**: veja no console
    console.log('Login bem-sucedido:', user);

    // Grava flag de sessão
    localStorage.setItem('usuarioLogado',
      JSON.stringify({ usuario: user.usuario, tipo: user.tipo })
    );

    // **DEBUG**: confirme que gravou
    console.log('Storage agora tem:', localStorage.getItem('usuarioLogado'));

    // Redireciona
    window.location.href = 'index.html';
  });
}
