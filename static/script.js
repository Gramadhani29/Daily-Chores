const API_URL = 'http://127.0.0.1:5000';
const choreList = document.getElementById('chore-list');
const choreForm = document.getElementById('chore-form');
const choreNameInput = document.getElementById('chore-name');
const assignedToSelect = document.getElementById('assigned-to');

let chores = [];

function showError(message) {
  console.error(message);
}

async function fetchChores() {
  try {
    const res = await fetch(`${API_URL}/chores`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    chores = await res.json();
    renderChores();
  } catch (err) {
    showError(`Gagal mengambil data: ${err.message}`);
  }
}

async function addChore(name, assigned_to) {
  try {
    const res = await fetch(`${API_URL}/chores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, assigned_to })
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const newChore = await res.json();
    chores.push(newChore);
    renderChores();
  } catch (err) {
    showError(`Gagal menambahkan tugas: ${err.message}`);
  }
}

async function toggleChoreStatus(id, is_done) {
  try {
    const res = await fetch(`${API_URL}/chores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done })
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const updated = await res.json();
    chores = chores.map(chore => chore.id === id ? updated : chore);
    renderChores();
  } catch (err) {
    showError(`Gagal memperbarui tugas: ${err.message}`);
  }
}

async function updateChore(id, name, assigned_to) {
  try {
    const res = await fetch(`${API_URL}/chores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, assigned_to })
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const updated = await res.json();
    chores = chores.map(chore => chore.id === id ? updated : chore);
    renderChores();
  } catch (err) {
    showError(`Gagal mengedit tugas: ${err.message}`);
  }
}

async function deleteChore(id) {
  try {
    const choreItem = document.querySelector(`[data-chore-id="${id}"]`);
    if (choreItem) {
      choreItem.classList.add('animate__animated', 'animate__fadeOutRight');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    const res = await fetch(`${API_URL}/chores/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    chores = chores.filter(chore => chore.id !== id);
    renderChores();
  } catch (err) {
    showError(`Gagal menghapus tugas: ${err.message}`);
  }
}

function renderChores() {
  choreList.innerHTML = '';
  chores.forEach(chore => {
    const li = document.createElement('li');
    li.setAttribute('data-chore-id', chore.id);
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';

    const leftPart = document.createElement('div');
    leftPart.style.display = 'flex';
    leftPart.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = chore.is_done;
    checkbox.addEventListener('change', () => {
      toggleChoreStatus(chore.id, checkbox.checked);
    });

    const label = document.createElement('span');
    label.innerHTML = `<strong>${chore.name}</strong> <em>${chore.assigned_to || ''}</em>`;
    label.style.marginLeft = '10px';
    if (chore.is_done) {
      label.style.textDecoration = 'line-through';
      label.style.opacity = '0.6';
    }

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.style.marginLeft = '10px';
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', () => {
        const newName = prompt('Edit nama tugas:', chore.name);
        if (!newName || newName.trim() === '') return;
      
        let newAssigned = prompt('Edit penugasan (Ayah, Ibu, Saya):', chore.assigned_to);
        if (newAssigned === null) return;
      
        newAssigned = newAssigned.trim();
        const allowed = ['Ayah', 'Ibu', 'Saya', ''];
      
        if (!allowed.includes(newAssigned)) {
          alert('Penugasan hanya boleh: Ayah, Ibu, Saya, atau dikosongkan.');
          return;
        }
      
        updateChore(chore.id, newName.trim(), newAssigned);
      });
      
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.style.border = 'none';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.fontSize = '1.2rem';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin menghapus tugas ini?')) {
        deleteChore(chore.id);
      }
    });

    leftPart.appendChild(checkbox);
    leftPart.appendChild(label);

    const rightPart = document.createElement('div');
    rightPart.appendChild(editBtn);
    rightPart.appendChild(deleteBtn);

    li.appendChild(leftPart);
    li.appendChild(rightPart);

    choreList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchChores();

  choreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = choreNameInput.value.trim();
    const assigned = assignedToSelect.value;
    if (name) {
      addChore(name, assigned);
      choreForm.reset();
    }
  });
});
