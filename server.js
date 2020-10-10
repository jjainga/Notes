let express = require("express");
let path = require("path");
let fs = require("fs");


// Sets up the Express App
// =============================================================
let app = express();
let PORT = 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"))

// // Routes
// // =============================================================
// // Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Gets data from JSON file
app.get("/api/notes", function(req,res) {
  fs.readFile("./Develop/db/db.json",'utf8', function(err,notes) {
    if (err) {
      throw err;
    }else {
      res.json(JSON.parse(notes));
    }
  })
})


// // Create new note and post to the DB
app.post("/api/notes", function(data, res) {
  let noteList = require("./Develop/db/db.json");
  noteList.push(data.body);
  fs.writeFile("./Develop/db/db.json",JSON.stringify(noteList,null,4), function(err,notes) {
    if(err) {
      throw err;
    }else {
      fs.readFile("./Develop/db/db.json",'utf8', function(err,notes) {
        if (err) {
          throw err;
        }else {
          res.json(JSON.parse(notes));
        }
      })
  }})
  
  
});

app.delete("api/notes", function(req, res) {

})

// // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
