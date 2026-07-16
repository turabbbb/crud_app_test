const STORAGE_KEY = 'simple-todo-list';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = loadTodos();

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function sayHello(){
  console.log("Hello, World!");
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  if (todos.length === 0) {
    list.innerHTML = '<li class="empty-state">No tasks yet. Add one above.</li>';
    return;
  }

  list.innerHTML = '';

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'completed' : '';

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const completeButton = document.createElement('button');
    completeButton.textContent = todo.completed ? 'Undo' : 'Done';
    completeButton.addEventListener('click', () => toggleTodo(todo.id));

    const editButton = document.createElement('button');
    editButton.className = 'secondary';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTodo(todo.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    actions.append(completeButton, editButton, deleteButton);
    item.append(text, actions);
    list.appendChild(item);
  });
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    text: trimmed,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;

  const updatedText = window.prompt('Edit task', todo.text);
  if (updatedText === null) return;

  const trimmed = updatedText.trim();
  if (!trimmed) return;

  todos = todos.map((item) => (item.id === id ? { ...item, text: trimmed } : item));
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

renderTodos();
