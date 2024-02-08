const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'login',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

app.use(
  session({
    secret: 'aluno',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('blog');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { nome, senha } = req.body;
  const query = 'SELECT * FROM cliente WHERE nome = ? AND senha = ?';

  db.query(query, [nome, senha], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.nome = nome;
      res.redirect('/');
    } else {
      res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
    }
  });
});

// CREATE
app.post('/add', (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO Postagens (name) VALUES (?)';

  db.query(sql, [name], (err, result) => {
    if (err) throw err;
    res.redirect('/teste');
  });
});

// DELETE
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Postagens WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.redirect('/teste');
  });
});

// READ
app.get('/postagens', (req, res) => {
  db.query('SELECT * FROM Postagens', (err, result) => {
    if (err) throw err;
    res.render('postagens', { postg: result });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


	
