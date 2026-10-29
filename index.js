const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const users = [];
const secretKey = "yourSecretKey";

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (users.some((user) => user.username === username)) {
    return res.status(409).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.status(201).send("User registered");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username: user.username }, secretKey);
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

const port = 3000;
app.listen(port, () => {
  console.log(
    `User Authentication Service running at http://localhost:${port}`,
  );
});
