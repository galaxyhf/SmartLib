document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("smartlib_usuario"));
    const linkFuncionario = document.querySelector('a[href="funcionario.html"]');
    const linkCadastroLivros = document.querySelector('a[href="cadastro-livros.html"]');

    const containerMensagem = document.createElement('div');
    containerMensagem.classList.add('mensagem-bloqueio');
    containerMensagem.innerHTML = `
        <section class="mensagem-permissao">
          <h2>🔒 Acesso restrito</h2>
          <p>Você não tem permissão para acessar essa área da SmartLib. Apenas funcionários podem acessar esta seção.</p>
          <div class="botoes-permissao">
            <button onclick="location.reload()">⬅️ Voltar</button>
            <button onclick="window.location.href='login.html'">🔁 Voltar para a Tela de Login</button>
          </div>
        </section>`;

    if (user?.tipo === "cliente") {
        if (linkFuncionario) {
            linkFuncionario.addEventListener('click', e => {
                e.preventDefault();
                const main = document.querySelector("main") || document.body;
                main.innerHTML = '';
                main.appendChild(containerMensagem);
            });
        }
        if (linkCadastroLivros) {
            linkCadastroLivros.addEventListener('click', e => {
                e.preventDefault();
                const main = document.querySelector("main") || document.body;
                main.innerHTML = '';
                main.appendChild(containerMensagem);
            });
        }
    }
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
          </div>`;

        userInfo.addEventListener("click", () => {
            const menu = document.getElementById("menu-dropdown");
            menu.style.display = menu.style.display === "flex" ? "none" : "flex";
        });

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

const btnTopo = document.getElementById("btnTopo");
window.addEventListener("scroll", () => {
    btnTopo.style.display = window.scrollY > 200 ? "block" : "none";
});
btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});