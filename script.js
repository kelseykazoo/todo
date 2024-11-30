
const API_URL = "https://todo-api-0v96.onrender.com/tasks";

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
    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch tasks: ${res.statusText}`);
        }
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
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Unable to fetch tasks. Please try again later.");
    }
};

// Add task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    if (!title) {
        alert("Task title is required!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
    });
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });

    fetchTasks();
    taskForm.reset();
        if (!res.ok) {
            throw new Error(`Failed to add task: ${res.statusText}`);
        }
        alert("Task added successfully!");
        fetchTasks();
        taskForm.reset();
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Unable to add task. Please try again.");
    }
});

// Delete task
const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) {
            throw new Error(`Failed to delete task: ${res.statusText}`);
        }
        alert("Task deleted successfully!");
        fetchTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Unable to delete task. Please try again.");
    }
};

// Toggle complete
// Toggle task completion
const toggleComplete = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
        });
        if (!res.ok) {
            throw new Error(`Failed to toggle task completion: ${res.statusText}`);
        }
        alert("Task status updated successfully!");
        fetchTasks();
    } catch (error) {
        console.error("Error toggling task completion:", error);
        alert("Unable to update task status. Please try again.");
    }
};

// Initial fetch
fetchTasks();
