let messageEl = $(".message");
let usernameEl = $(".username");
let submitEl = $(".submit");
let noteListEl = $(".note-list");

const Note = skygear.Record.extend('note');

// Append to list
function addNoteToList(username, message) {
  let listItem = $(`<li>${username}: ${message}</li>`);
  noteListEl.append(listItem);
}


// Cloud functions
function saveNote(username, message) {
  const note = new Note({ 'message': message, 'username': username });

  // Save the note
  skygear.publicDB.save(note).then((savedNote) => {
    // The saved note at savedNote
    addNoteToList(savedNote.username, savedNote.message);
  }, (error) => {
    console.error(error);
  });
}

function loadNotes() {
  const Note = skygear.Record.extend('note');
  const query = new skygear.Query(Note);
  skygear.publicDB.query(query).then((notes) => {
    // Loop through the notes
    console.log(notes);
    let noteCount = notes.length;
    for (let i =0; i< noteCount; i++) {
      addNoteToList(notes[i].username, notes[i].message);
    }

  }, (error) => {
    console.error(error);
  });
}

//  Event Handler

submitEl.on("click", function(e) {
  let username = usernameEl.val();
  let message = messageEl.val();
  alert(`Message received! \n${usernameEl.val()}: ${messageEl.val()}`)

  if (username !== "" && message !== "") {
    saveNote(username, message);
  }
});

// Config Skygear

skygear.config({
  'endPoint': 'https://noteapp.skygeario.com/', // trailing slash is required
  'apiKey': '6abbf032a68a47c1bd4ad2e703979746',
  }).then(() => {
  console.log('skygear container is now ready for making API calls.');
  if (!skygear.auth.currentUser) {
    skygear.auth.signupAnonymously().then((user) => {
      console.log(user); // user record
      loadNotes();
    }, (error) => {
      console.error(error);
    });
  } else {
    loadNotes();
  }

}, (error) => {
  console.error(error);
});

