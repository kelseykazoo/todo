const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const API_URL = "http://localhost:3000/tasks";

// Fetch tasks
const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    taskList.innerHTML = tasks
        .map(
            (task) => `
    <li>
      <span>${task.title} - ${task.completed ? "✅" : "❌"}</span>
      <button onclick="deleteTask('${task._id}')">Delete</button>
      <button onclick="toggleComplete('${task._id}', ${task.completed})">Toggle Complete</button>
    </li>
  `,
        )
        .join("");
};

// Add task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
    });

    fetchTasks();
    taskForm.reset();
});

// Delete task
const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
};

// Toggle complete
const toggleComplete = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
};

// Initial fetch
fetchTasks();
