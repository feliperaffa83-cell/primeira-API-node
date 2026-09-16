// Importa o módulo better-sqlite3
const Database = require("better-sqlite3");

// Cria ou abre o banco de dados
const db = new Database("cadastros.db");

// Cria a tabela caso ela ainda não exista
db.prepare(`
    CREATE TABLE IF NOT EXISTS cadastros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER,
        sexo TEXT,
        cpf TEXT NOT NULL,
        moradia TEXT,
        estado_civil TEXT
    )
`).run();

module.exports = db;