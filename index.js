document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;
        const tipo = document.getElementById('tipo').value;
        const erroEl = document.getElementById('error-message');

        if (!usuario || !senha || !tipo) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/login/${tipo}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, senha })
            });

            const data = await response.json();

            if (!response.ok || data.erro) {
                erroEl.textContent = data.erro || "Usuário ou senha inválidos.";
                erroEl.style.display = "block";
                return;
            }

            localStorage.setItem("smartlib_usuario", JSON.stringify(data));
            window.location.href = "index.html";
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
            console.error(err);
        }
    });
});