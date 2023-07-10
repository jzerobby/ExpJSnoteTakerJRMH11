let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let selectedNote = null;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
fetch('/api/notes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then((response) => {
  console.log('Response status:', response.status);
  return response.json();
})
.then((data) => {
  console.log('Response data:', data);
  return data;
})
.catch((error) => {
  console.log('Error getting notes:', error);
});


const saveNote = (note) =>
fetch('/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(note),
});

const deleteNote = (id) =>
fetch(`/api/notes/${id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
});

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (selectedNote) {
    // Display the selected note on the right side
    const selectedNoteTitle = document.querySelector('.selected-note-title');
    const selectedNoteText = document.querySelector('.selected-note-text');

    selectedNoteTitle.textContent = selectedNote.title;
    selectedNoteText.textContent = selectedNote.text;
  } else {
    // Clear the right side if no note is selected
    const selectedNoteTitle = document.querySelector('.selected-note-title');
    const selectedNoteText = document.querySelector('.selected-note-text');

    selectedNoteTitle.textContent = '';
    selectedNoteText.textContent = '';
  }
};


const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  console.log('Saving note:', newNote);

  saveNote(newNote)
    .then(() => {
      // Create a new list item
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.innerHTML = `
        <h5>${newNote.title}</h5>
        <p>${newNote.text}</p>
      `;

      // Append the list item to the list container
      noteList.appendChild(listItem);

      // Clear the input and textarea
      noteTitle.value = '';
      noteText.value = '';
    })
    .then(() => {
      console.log('Note saved successfully');
      getAndRenderNotes();
      renderActiveNote();
    });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  console.log('Deleting note with ID:', noteId);

  deleteNote(noteId).then(() => {
    console.log('Note deleted successfully');
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  const noteItem = e.target.closest('.list-group-item');
  const noteData = JSON.parse(noteItem.dataset.note);
  activeNote = { ...noteData };
  selectedNote = { ...noteData };
  renderNoteList([]);
  renderActiveNote();

  noteTitle.value = activeNote.title;
  noteText.value = activeNote.text;
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  e.preventDefault();
  activeNote = {};
  renderActiveNote();

  noteTitle.value = '';
  noteText.value = '';
};

const handleRenderSaveBtn = () => {
  if (noteTitle.value.trim() && noteText.value.trim()) {
    show(saveNoteBtn);
  } else {
    hide(saveNoteBtn);
  }
};

const renderNoteList = async (notes) => {
  console.log('Rendering note list');
  let jsonNotes = await notes.json();
  console.log('JSON notes:', jsonNotes);

  noteList.innerHTML = '';

  if (jsonNotes.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('list-group-item');
    emptyMessage.textContent = 'No saved notes';
    noteList.appendChild(emptyMessage);
    return;
  }

  jsonNotes.forEach((note) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.dataset.note = JSON.stringify(note);
    listItem.innerHTML = `
      <span class="list-item-title">${note.title}</span>
      <i class="fas fa-trash-alt float-right text-danger delete-note"></i>
    `;

    const deleteIcon = listItem.querySelector('.delete-note');
    deleteIcon.addEventListener('click', handleNoteDelete);

    const listItemTitle = listItem.querySelector('.list-item-title');
    listItemTitle.addEventListener('click', () => handleNoteView(note)); // Modified line

    // Add a class to the selected note's list item
    if (selectedNote && selectedNote.id === note.id) {
      listItem.classList.add('active');
    }

    noteList.appendChild(listItem);
  });

  console.log('Note list rendered');

  const selectedNoteId = selectedNote ? selectedNote.id : null;
  const renderedNoteItems = noteList.querySelectorAll('.list-group-item');
  renderedNoteItems.forEach((noteItem) => {
    const noteData = JSON.parse(noteItem.dataset.note);
    if (noteData.id === selectedNoteId) {
      activeNote = { ...noteData };
      renderActiveNote();
    }
  });
};



const getAndRenderNotes = () => {
  console.log('Getting and rendering notes');
  getNotes()
    .then(renderNoteList)
    .catch((error) => {
      console.log('Error getting notes:', error);
    });
};

// Call getAndRenderNotes to initially render the note list
getAndRenderNotes();

if (window.location.pathname === '/notes') {
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', handleNoteSave);
  }

  if (newNoteBtn) {
    newNoteBtn.addEventListener('click', handleNewNoteView);
  }

  if (noteTitle) {
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  }

  if (noteText) {
    noteText.addEventListener('keyup', handleRenderSaveBtn);
  }
}

getAndRenderNotes();
