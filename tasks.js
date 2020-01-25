const express = require("express");
const serverlessHttp = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", function(req, res) {
  res.status(200).json({ tasks: ["Finish homework", "Pay bills", "Do shopping"] });
});

app.post("/tasks", function(req, res) {
  const text = req.body.text;
  const date = req.body.date;

  res.status(200).json({
    message: `Received a request to add task ${text} with date ${date}`
  });
});

app.delete("/tasks/:taskId", function(req, res) {
  const id = req.params.taskId;

  res.status(200).json({
    message: `Deleted task ID ${id}`
  });
});

module.exports.handler = serverlessHttp(app);





