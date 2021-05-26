const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true })); 

mongoose.set("useFindAndModify", false);
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
console.log("Kết nối cơ sở dữ liệu!");
app.listen(8080, () => console.log("Khởi động server"));
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("home.ejs", { todoTasks: tasks });
    });
    });

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

app
    .route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("edit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
    app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
        });
        });

    