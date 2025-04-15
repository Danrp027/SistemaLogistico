const express = require('express');
const path = require('path');
const sqlite = require('sqlite3').verbose();
const multer = require('multer');
const upload = multer();

const app = express();

app.use(express.json());


const db = new sqlite.Database("Logistica.sqlite");

app.use(express.static(path.join(__dirname, "public")));



function Criar_tabela() {
    var query = 'CREATE TABLE IF NOT EXISTS PRODUTOS(';
    query += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,';
    query += 'REFERENCIA INT,';
    query += 'AMARRACAO INT,';
    query += 'CAMADAS INT,';
    query += 'FOTO BLOB)';

    db.run(query, (err) => {
        if (err) console.log(err);
        else console.log('Tabela Criada com Sucesso!');
    });
}




//Criar_tabela()



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/login.html"));
});





app.post('/addproduto', upload.single('foto'), function (req, res) {

    console.log(req.body);

    var referencia = req.body.referencia;
    var amarracao = req.body.amarracao;
    var camadas = req.body.camadas;
    var foto = req.file.buffer;

    var sql = 'INSERT INTO PRODUTOS (REFERENCIA, AMARRACAO, CAMADAS, FOTO) VALUES (?, ?, ?, ?)';

    db.run(sql, [referencia, amarracao, camadas, foto], (err) => {
        if (err) res.send(err);
        else res.send('Dados Inseridos com Sucesso!');
    });
});










app.get("/consultar/:buscar", (req, res) => {
    const referencia = req.params.buscar;

    var sql = "SELECT * FROM PRODUTOS WHERE REFERENCIA = ?";

    db.all(sql, [referencia], (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return res.status(500).send('Erro ao consultar os produtos.');
        }
        if (rows.length === 0) {
            return res.status(404).send('Produto não encontrado.');
        }

        const resultado = rows.map(row => ({
            ...row,
            FOTO: row.FOTO ? `data:image/jpeg;base64,${row.FOTO.toString('base64')}` : null
        }));

        res.json(resultado);
    });
});












app.post('/validarlogin', function (req, res) {
    
    console.log(req.body);

    var usuario = req.body.usuario
    var senha = req.body.senha

    if (usuario == 'recebimento' && senha == '2024') res.send('principal.html')
    else res.send('/')
})






app.listen(3000, console.log("Rodando... http://localhost:3000"));

