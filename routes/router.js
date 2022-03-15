const dotenv = require("dotenv");
const express = require("express");
const route = express.Router();
const cors = require("cors");
const uuid = require('uuid');
const db = require("../config/conf.js");
const storage = require("../config/blobStorage.js");

//define storage name
const bucket = storage.bucket("gs://simple-todo-138ad.appspot.com");

//define table collection
const Uploads = db.collection("Uploads");
const Todos = db.collection("Todos");

route.post("/upload", (req, res) => {
  if(req.files){
    var file = req.files.file;
    var filename = file.name;
    file.mv(`${__dirname}/../public/${filename}`, function(err){
      if(err){
          res.send({ msg: err});

      }else{
        bucket.upload(`${__dirname}/../public/${filename}`, {
            destination: filename,
            metadata: {
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          });

        Uploads.add({ filename: filename, filepath: `${__dirname}/../public/${filename}`});
        res.send({ msg: "File Uploaded!"});
      }
    });
  }
});

route.post("/blobUpload", (req, res) => {
  if(req.files){
    var file = req.files.file;
    var filename = file.name;
    console.log(filename);
    file.mv(`${__dirname}/../public/${filename}`, function(err){
      if(err){
          res.send({ msg: err});

      }else{
        bucket.upload(`${__dirname}/../public/${filename}`, {
            destination: filename,
            metadata: {
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          });

        res.send({ msg: "Blob File Uploaded to Firebase storage!"});
      }
    });
  }
});

route.get("/uploads", async (req, res) => {
  const snapshot = await Uploads.get();
  const lists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log()
  res.send(lists);
});

route.get("/todos", async (req, res) => {
  const snapshot = await Todos.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});


route.post("/todos/create", async (req, res) => {
  const data = req.body;
  await Todos.add({ data });
  res.send({ msg: "Task has been Added" });
});



route.post("/todos/update", async (req, res) => {
  const id = req.body.id;
  delete req.body.id;
  const data = req.body;
  await Todos.doc(id).update(data);
  res.send({ msg: "Task id #"+id+" has been updated" });
});



route.post("/todos/delete", async (req, res) => {
  const id = req.body.id;
  await Todos.doc(id).delete();
  res.send({ msg: "Task id #"+id+" has been deleted" });
});


module.exports = route;