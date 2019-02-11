const express = require("express");
const db = require("./data/db");
const server = express(); //creates a new http server

//middleware
//parse the body request it's like body-parser
//to teach express to read json
server.use(express.json());

// routes
server.get("/", (req, res) => {
  res.json({
    id: 1,
    name: "JB Miranda",
    age: 22
  });
});
// get date
server.get("/now", (req, res, next) => {
  const now = new Date().toISOString();
  res.send(now);
});

// CRUD
//READ
server.get("/hub", (req, res) => {
  db.hubs
    .find()
    .then(hub => {
      res.status(200).json({ success: true, hub });
    })
    .catch(err => {
      res.status(err.code).json({ success: false, message: err.message });
    });
});
// CREATE
server.post("/hub", (req, res) => {
  const hub = req.body;
  db.hubs
    .add(hub)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(({ code, message }) => {
      res.status(code).json(message);
    });
});
// DELETE
server.delete("/hub/:id", (req, res) => {
  const { id } = req.params;
  db.hubs
    .remove(id)
    .then(hub => {
      // res.status(204).json({ success: true, hub });
      res.status(204).end();
    })
    .catch(({ code, message }) => {
      res.status(code).json(message);
    });
});
//UPDATE
server.put("/hub/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db.hubs
    .update(id, changes)
    .then(updated => {
      //check if id is there
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: "I cannot find the hub you're looking for"
        });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json(message);
    });
});

server.listen(4000, () => {
  console.log("\n*** Running on port 4000 ***\n");
});
