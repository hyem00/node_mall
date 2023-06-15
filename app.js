const express = require("express");
const app = express();
const port = 3000;
const goodsRouter = require("./routes/goods.js");
const catrsRouter = require("./routes/carts.js");
const connect = require("./schemas"); //index 안써줘도 알아서 긁어온댜

connect();

//미들웨어
app.use(express.json());

app.use("/api", [goodsRouter, catrsRouter]);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸습니다");
});
