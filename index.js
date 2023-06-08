require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//express app
const app = express();

//middlewares
app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());

//route
app.get("/", (req, res) => {
  res.status(200).json({ message: "wellcome to server" });
});

//PORT
const port = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;

//mongoose
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`mongose connected and server running on port ${port}`);
    });
  });
