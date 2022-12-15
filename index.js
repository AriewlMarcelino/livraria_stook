import express from "express";
import exphbs from "express-handlebars";
import mysql from "mysql";

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

//get para resgatar todas os nosso dados
app.get("/books", (req, res) => {
  const mysql = "SELECT * FROM booksnode";

  conn.query(mysql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    const books = data;
    console.log(books);

    res.render("books", { books });
  });
});

//criando uma query para fazer requisições individualmente por um id params
app.get("/books/:id", function (req, res) {
  const id = req.params.id;

  const mysql = `SELECT * FROM booksnode WHERE id = ${id}`;

  conn.query(mysql, function (err, data) {
    if (err) {
      console.log(err);
    }

    const book = data[0];
    console.log(data[0]);
    res.render("book", { book });
  });
});

//construindo uma rota para edição de uma informação em nosso site;
app.get("/books/edit/:id", function (req, res) {
  const id = req.params.id;

  const mysql = `SELECT * FROM booksnode WHERE id = ${id}`;

  conn.query(mysql, function (err, data) {
    if (err) {
      console.log(err);
      return
    }

    const book = data[0];
    console.log(data[0]);
    res.render("editbook", { book });
  });
});

//atualizando um dado via post;
app.post('/books/updatebook',(req,res)=>{
  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  const sql = `UPDATE booksnode SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
      return
    }

    res.redirect('/books')
  });

})

app.post('/books/remove/:id',(req,res)=>{
  const id = req.params.id
  const sql = `DELETE FROM booksnode WHERE id = ${id}`

  conn.query(sql, function(err){
    if(err){
      console.log(err)

      return
    }

    res.redirect('/books')
  })

})

app.post("/books/insertbook", function (req, res) {
  const title = req.body.title;
  const pageqty = req.body.pageqty;

  const query = `INSERT INTO booksnode (title, pageqty) VALUES ('${title}', '${pageqty}')`;

  conn.query(query, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect("/books");
  });
});

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql",
});

conn.connect(function (err) {
  if (err) {
    console.log(err);
  }

  console.log("Conectado ao MySQL!");

  app.listen(3000);
});
