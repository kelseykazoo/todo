const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
require("dotenv").config();
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Task Model
const Task = require("./models/task");

// Routes
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    const { title, description, deadline } = req.body;
    const task = new Task({ title, description, deadline, completed: false });
    await task.save();
    res.status(201).json(task);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});