const express = require("express");
const { MongoClient } = require("mongodb");
const port = 4000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const fs = require("fs-extra");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
const jsonParser = express.json();
app.use(express.json());
app.use(express.static("Books"));
app.use(fileUpload());

const uri =
  "mongodb+srv://rubel-ahmed:nAyqSovpijg0p4v1@cluster0.jmsmx.mongodb.net/Book?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("Book").collection("Project");
  const addCollection = client.db("Book").collection("Projects");
  // mongoDb file upload.................................................
  app.post("/add", (req, res) => {
    let exampleReq = req.files.exampleReq;
    let name = req.body.example;
    let author = req.body.exampleRequired;
    let price = req.body.exampleRequiredEnd;
    const newImg = exampleReq.data;
    const encImg = newImg.toString("base64");
    var image = {
      contentType: exampleReq.mimetype,
      size: exampleReq.size,
      img: Buffer.from(encImg, "base64"),
    };
    const Upload = `${__dirname}/Books/${exampleReq.name}`;
    exampleReq.mv(Upload, (error) => {
      if (error) {
        console.log(err);
        return res.status(5000).send({ meg: "failed to image upload" });
      }
      addCollection.insertOne({ name, author, price, image }).then((result) => {
        if (err) {
          console.log("rubel");
        }
        fs.remove(Upload);
        res.send(result.insertedCount > 0);
      });
    });
  });
  // mongoDb file upload End.........................................................
  app.get("/add", (req, res) => {
    addCollection.find().toArray((err, result) => {
      res.send(result);
    });
  });
  // folder fill set up start.......................................................
  // app.post("/addADoctor", (req, res) => {
  //   let exampleReq = req.files.exampleReq;
  //   let name = req.body.example;
  //   let author = req.body.exampleRequired;
  //   let price = req.body.exampleRequiredEnd;
  //   exampleReq.mv(`${__dirname}/Books/${exampleReq.name}`, (err) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(5000).send({ meg: "failed to image upload" });
  //     }
  //     collection
  //       .insertOne({
  //         name,
  //         author,
  //         price,
  //         img: exampleReq.name,
  //       })
  //       .then((result) => {
  //         if (err) {
  //           console.log("rubel");
  //         }
  //         res.send(result.insertedCount > 0);
  //       });
  //   });
  // });
  // folder fill set up end............................................................
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
