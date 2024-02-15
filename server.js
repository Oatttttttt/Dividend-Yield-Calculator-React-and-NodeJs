const express = require("express");
const cors = require("cors");
var axios = require("axios");
const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Dividend Yield Calculator");
});

app.get("/stocks/:name", async function (req, res, next) {
  const namestocks = req.params.name;
  try {
    const Url =
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
      namestocks +
      ".BK?range=5y&interval=1mo&events=div";
    const response = await axios.get(Url);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
