const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('body-parser');
const app = express();
// make the sever able to run from parameter from the environment.
var PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// setting up path for html pages
// path to index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});
// path to notes.html page
app.get('/notes',(req, res) => {
    res.sendFile(path.join(__dirname,"./public/notes.html"))
});

// send json of all notes if user access /api/notes
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (error, notes) => {
        if(error){
            return console.log(error)
        } res.json(JSON.parse(notes))
    })
});

// POST method to send user input to backend
app.post("/api/notes", (req, res) => {
    // note is saved by user
    const currentNote = req.body;
    // get notes from db.json, saved the id 
    // new id, save the new id
    fs.readFile(path.join(__dirname,"./db/db.json"), "utf-8", (error, notes) => {
        if(error) {
            return console.log(error)
        } notes = JSON.parse(notes)
        // assign id to each new note
        // if no items in notes array, assign as 10
        if (notes.length > 0) {
            let lastId = notes[notes.length - 1].lastId
            var id = parseInt(lastId) + 1
        } else {
            var id = 10;
        }
        // create new object
        let newNotes = {
            title: currentNote.title,
            text: currentNote.text,
            id: id
        }
        // merging new note with existing notes array
        var newNotesArr = notes.concat(newNotes)
        // write new array to db.json
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArr), (error, data) => {
            if(error) {
                return error
            } console.log(newNotesArr)
            res.json(newNotesArr)
        })
    })
});
// delete notes using delete http method
app.delete('/api/notes/:id', (req, res) => {
    let deleteId = JSON.parse(req.params.id);
    console.log("ID to be deleted", deleteId);
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (error, notes) => {
        if(error) {
            return console.log(error)
        }
        let notesArray = JSON.parse(notes);
        for(var i = 0; i <notesArray.length; i++) {
            if(deleteId == notesArray[i].id) {
                notesArray.splice(i,1)
                fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
                    if(error) {
                        return error
                    } console.log(notesArray)
                    res.json(notesArray);
                })
            }
        }
    });
});





// Run on Port
app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`))