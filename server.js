const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ========================
// ROTA DE LOGIN
// ========================
app.post('/login/:tipo', async (req, res) => {
    const { tipo } = req.params;
    const { usuario, senha } = req.body;

    if (!['cliente', 'funcionario'].includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo de conta inválido' });
    }

    const tabela = tipo === 'cliente' ? 'clientes' : 'funcionarios';

    try {
        const result = await pool.query(
            `SELECT * FROM ${tabela} WHERE usuario = $1`,
            [usuario]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(senha, user.senha);

        if (!match) {
            return res.status(403).json({ erro: 'Senha incorreta' });
        }

        res.json({
            id: user.id,
            nome: user.nome,
            usuario: user.usuario,
            tipo: tipo
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// ========================
// ROTA DE CADASTRO - CLIENTE
// ========================
app.post('/cadastro/cliente', async (req, res) => {
    const { nome, email, usuario, senha } = req.body;

    try {
        const existe = await pool.query(
            'SELECT 1 FROM clientes WHERE usuario = $1',
            [usuario]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ erro: 'Usuário já existe' });
        }

        const hash = await bcrypt.hash(senha, 10);

        await pool.query(
            `INSERT INTO clientes (nome, email, usuario, senha, cpf, endereco, telefone)
             VALUES ($1, $2, $3, $4, '00000000000', '', '')`,
            [nome, email, usuario, hash]
        );

        res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso' });
    } catch (err) {
        console.error('Erro no cadastro de cliente:', err);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// ========================
// ROTA DE CADASTRO - FUNCIONÁRIO
// ========================
app.post('/cadastro/funcionario', async (req, res) => {
    const { nome, email, usuario, senha } = req.body;

    try {
        const existe = await pool.query(
            'SELECT 1 FROM funcionarios WHERE usuario = $1',
            [usuario]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ erro: 'Usuário já existe' });
        }

        const hash = await bcrypt.hash(senha, 10);

        await pool.query(
            `INSERT INTO funcionarios (nome, email, usuario, senha, cargo, matricula)
             VALUES ($1, $2, $3, $4, 'Padrão', NULL)`,
            [nome, email, usuario, hash]
        );

        res.status(201).json({ mensagem: 'Funcionário cadastrado com sucesso' });
    } catch (err) {
        console.error('Erro no cadastro de funcionário:', err);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// ========================
// INICIALIZAÇÃO DO SERVIDOR
// ========================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
