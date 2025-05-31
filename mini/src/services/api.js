const API_URL = 'http://localhost:5000';

export const fetchNotes = async () => {
  const response = await fetch(`${API_URL}/notes`);
  if (!response.ok) throw new Error('Failed to fetch notes');
  // If the backend returns an object with a 'notes' array, return that
  const data = await response.json();
  return Array.isArray(data) ? data : data.notes;
};

export const createNote = async (noteData) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('Failed to create note');
  return response.json();
};

export const likeNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/like`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to like note');
  return response.json();
};

export const unlikeNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/unlike`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to unlike note');
  return response.json();
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete note');
  return response.json();
}; 