// server.js
const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ❌ NÃO use app.get('*', …) nem app.get('/*', …)

// ✅ Use regex que casa com qualquer rota:
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://172.16.41.104:${PORT}`);
});
