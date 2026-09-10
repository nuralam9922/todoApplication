import express from "express"
import crypto from "crypto"
import cors from "cors";
 
const app = express();

const todos = [];

app.use(express.json());
app.use(cors({
    origin: "https://todoapplication-0f72.onrender.com"
}));

app.get("/api/todos", (req, res) => {
    res.json(todos);

});
app.patch("/api/todos/:id", (req, res) => {
    console.log(req.body);
    
    const todo = todos.find((todo) => {
        if (todo.id === req.params.id) return todo;
    })

    if (todo) {

        todo.completed = req.body.completed;

        res.status(200).json({
            message: "Updation successfull"
        })
    } else{
         res.status(404).json({
            message: "The todo not found"
        })
    }


});

app.delete("/api/todos/:id", (req, res) => {
    const todoIndex = todos.findIndex((todo) =>todo.id === req.params.id)


    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        res.status(200).json({
            message: "Deletion successfull"
        })
    } else{
         res.status(404).json({
            message: "Todo not found, delete not successfull"
        })
    }


});


app.post("/api/todos", (req, res) => {

    if (!req.body.text || req.body.text.trim().length === 0) {
        return res.status(400).json({
            message: "Text is required"
        })
    }

    const uniqueid = crypto.randomUUID();
    const date = new Date().toISOString();
    todos.push({
        id: uniqueid,
        text: req.body.text,
        completed: false,
        createdAt: date
    })

    res.status(201).json({
        message: "Todo created",
        id: uniqueid,
        createdAt: date
    });
})

const PORT = process.env.PORT || 8055;

app.listen(PORT, "0.0.0.0", () => {
    console.log("server is ready!");
});


