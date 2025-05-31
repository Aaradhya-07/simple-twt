const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Note = require('./models/Note');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/notes', async (req, res) => {
  try {
    const { content, author } = req.body;
    const note = new Note({ content, author });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: `Error creating note: ${error.message}` });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find()
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: `Error fetching notes: ${error.message}` });
  }
});

app.patch('/notes/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.likes = (note.likes ?? 0) + 1;
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: `Error liking note: ${error.message}` });
  }
});

app.patch('/notes/:id/unlike', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.likes = Math.max((note.likes ?? 0) - 1, 0);
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: `Error unliking note: ${error.message}` });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting note: ${error.message}` });
  }
});

const PORT = 5000;
const MONGODB_URI = 'mongodb+srv://Aaradhya07:aaradhya07@cluster0.3jno3wu.mongodb.net/mini-twitter';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }); 