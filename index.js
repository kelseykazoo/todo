const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Task Model
const Task = require("./task");

// Routes
app.post("/tasks", async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Task title is required" });
    }

    const task = new Task({ title, description, completed: false });

    try {
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: "Error saving task" });
    }
});


app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(204).send();
});

// Start Server
const PORT = process.env.PORT || 3000; // Use Render's PORT variable
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
