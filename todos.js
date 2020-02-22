const express = require("express");
const serverlessHttp = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todos"
});

app.get("/todos", function(req, res) {
  console.log("RECEIVED REQUEST FOR GET /todos");
  connection.query("SELECT * FROM Task", function(err, data) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      const mapped = data.map(tasks => {
        tasks.completed = tasks.completed === 1 ? true : false;
        tasks.important = tasks.important === 1 ? true : false;
        return tasks;
      });
      res.status(200).json({
        todos: mapped
      });
    }
  });
});

// app.post("/todos", function(req, res) {
//   const text = req.body.text;
//   const date = req.body.date;

//   res.status(200).json({
//     message: `Received a request to add task ${text} with date ${date}`
//   });
// });

app.post("/todos", function(req, res) {
  console.log("RECEIVED REQUEST FOR POST /todos", { data: req.body });
  const newTask = req.body;
  connection.query("INSERT INTO Task SET ?", [newTask], function(
    err,
    data
  ) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      newTask.id = data.insertId;
      newTask.dateDue= new Date(newTask.dueDate).toISOString();
      res.status(201).json(newTask);
    }
  });
});

app.put("/todos/:id", function(req, res) {
  let updatedTask = req.body;
  updatedTask.completed = updatedTask.completed == true ? 1 : 0;
  console.log(updatedTask)
  const id = req.params.id;
  console.log(`RECEIVED REQUEST FOR PUT /todos/${id}`, {
    data: updatedTask
  });
  connection.query(
    `UPDATE Task SET ? WHERE taskID=?`,
    [updatedTask, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// app.delete("/todos/:taskId", function(req, res) {
//   const id = req.params.taskId;

//   res.status(200).json({
//     message: `Deleted task ID ${id}`
//   });
// });

app.delete("/todos/:id", function(req, res) {
  const id = req.params.id;
  connection.query("DELETE FROM Task WHERE taskID=?", [id], function(err) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.sendStatus(200);
    }
  });

});

module.exports.handler = serverlessHttp(app);





