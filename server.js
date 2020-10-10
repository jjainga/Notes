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

// Displays a single notes, or shows "No note found"
app.get("/api/notes/:id", function(req, res) {
  var chosen = Number(req.params.id);
  console.log(chosen);
  let notes = require("./Develop/db/db.json")
  console.log(notes);
  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].id) {
      return res.json(notes[i]);
    }
  }
  return res.send("No notes found");
});


// // Create new note and post to the DB
app.post("/api/notes", function(data, res) {
  let noteList = require("./Develop/db/db.json");
  //Creating a random id
  data.body.id = Math.floor(Math.random()*9999999)
  noteList.push(data.body);
  fs.writeFile("./Develop/db/db.json",JSON.stringify(noteList,null,4), function(err,notes) {
    if(err) {
      throw err;
    }else {
      res.json(true)
  }})
});

app.delete("/api/notes/:id", function(id, res) {
  let noteList = require("./Develop/db/db.json");
  let index = noteList.findIndex( note => note.id === Number(id.params.id));
    noteList.splice(index, 1);
  fs.writeFile("./Develop/db/db.json",JSON.stringify(noteList,null,4), function(err,notes) {
    if(err) {
      throw err;
    }else {
       res.json(true)
  }})

})

// // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
