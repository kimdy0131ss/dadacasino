const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("users.db");

// CORS 설정
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json());

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  userbirth TEXT,
  userid TEXT UNIQUE,
  password TEXT
)`);

app.post("/signin", (req, res) => {
  const { username, userbirth, userid, password } = req.body;
  db.run(`INSERT INTO users (username, userbirth, userid, password) VALUES (?, ?, ?, ?)`, [username, userbirth, userid, password],
    function(err) {
        if (err) return res.send("이미 존재하는 아이디입니다.");
        res.send("회원가입 성공!");
    });
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).send("회원정보 조회 실패");
    res.json(rows);
  });
});

app.listen(3000, () => console.log("서버 실행 중"));

