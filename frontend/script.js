import { addTodo, getTodo, updateStatus, deleteTodo } from "./api/todos.api.js"


const modeIcon = document.querySelector(".modeIcon");
const body = document.querySelector("body");

const todoBtn = document.querySelector(".submit");
const deleteBtn = document.querySelector(".delete");
const input = document.querySelector("input");
const todoArea = document.querySelector(".todoArea");
const taskCount = document.querySelector(".taskCount");

// setters
const theme = localStorage.getItem("theme");
body.classList.add(theme)




function handleMode(event) {

    const current = event.currentTarget;
    const moon = current.querySelector(".bi-moon-fill");
    const sun = current.querySelector(".bi-sun-fill");

    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        sun.classList.add("hide");
        moon.classList.remove("hide");
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add("dark");
        moon.classList.add("hide");
        sun.classList.remove("hide");
        localStorage.setItem('theme', 'dark');
    }
}

let selectedMessageArea = null;
async function handleDeleteTodo(event) {
    if (selectedMessageArea) {
        deleteBtn.classList.add("btnAnimation");
        try {
            await deleteTodo(selectedMessageArea.id)


            selectedMessageArea.remove();
            selectedMessageArea = null;

            deleteBtn.classList.add("hide");

            taskCount.textContent = `${todoArea.querySelectorAll(".messageArea").length} tasks`;

            if (todoArea.querySelectorAll(".messageArea").length == 0) {
                todoArea.querySelector(".emptyState").classList.remove("hide");
            }

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            deleteBtn.classList.remove("btnAnimation");
        }


    }

}

function handleMessageArea(event) {
    const current = event.currentTarget;

    if (selectedMessageArea) {
        selectedMessageArea.classList.remove("messageAreaOnSelected");
    }

    current.classList.add("messageAreaOnSelected")
    selectedMessageArea = current;
    deleteBtn.classList.remove("hide");

}

async function handleStatus(event) {
    event.stopPropagation();
    const checkbox = event.currentTarget;
    const parentId = event.target.parentElement.id;


    try {
        await updateStatus(parentId, checkbox.checked);
    } catch (error) {
        console.error(error);
        alert(error.message);

        // Restore the previous checkbox state if the API fails
        checkbox.checked = !checkbox.checked;
    }


}

function renderTodo(text, id, completed, createdAt) {
    const messageArea = document.createElement("div");
    messageArea.classList.add("messageArea");
    messageArea.id = id;



    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = completed;

    const p = document.createElement("p");
    p.textContent = text;
    if (completed) {
        p.style.textDecoration = "line-through";
    }

    const timeStamp = document.createElement("span");
    timeStamp.classList.add("timeStamp");


    // ++++++++++++++++ Time calculation +++++++++++++++++++++++++++
    const date = new Date(createdAt);

    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = date.getHours() >= 12 ? "PM" : "AM";

    timeStamp.textContent =
        `${hours}:${minutes} ${period} | ` +
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;


    // +++++++++++++++ event listeners +++++++++++++++++++++++++++++++
    messageArea.addEventListener("click", handleMessageArea);
    checkbox.addEventListener("click", handleStatus);
    checkbox.addEventListener("change", () => {
        p.style.textDecoration = checkbox.checked ? "line-through" : "none";
    });


    // appending of created html element
    messageArea.appendChild(checkbox);
    messageArea.appendChild(p);
    messageArea.appendChild(timeStamp);
    todoArea.prepend(messageArea);

}

async function renderTodos() {
    todoArea.innerHTML = '<p class="loadingState">Loading tasks...</p>';

    try {
        const data = await getTodo();
        todoArea.replaceChildren();

        data.forEach((todo) => {
            renderTodo(todo.text, todo.id, todo.completed, todo.createdAt);
        });

        if (data.length === 0) {
            todoArea.innerHTML = '<p class="emptyState">Your list is clear. Add something small to get started.</p>';
        }

        taskCount.textContent = `${data.length} tasks`;
    } catch (error) {
        todoArea.innerHTML = '<p class="emptyState">Could not load your tasks.</p>';
        console.error(error);
    }
}


async function handelAddTodo() {
    const text = input.value.trim();

    if (text.length === 0) {
        alert("Please enter a task.");
        return;
    }
    //++++++++++++++++++++++++++++++ Rendering of todo +++++++++++++++++++++++++++
    todoBtn.classList.add("btnAnimation");


    try {
        const response = await addTodo(text);
        renderTodo(text, response.id, false, response.createdAt);
    } catch (error) {
        console.error("There is a problem in creating todo");
    } finally {
        todoBtn.classList.remove("btnAnimation");
    }



    if (todoArea.querySelector(".emptyState")) {
        todoArea.querySelector(".emptyState").classList.add("hide");
    }



    input.value = "";
    taskCount.textContent = `${todoArea.querySelectorAll(".messageArea").length} tasks`;
}



modeIcon.addEventListener("click", handleMode);
todoBtn.addEventListener("click", handelAddTodo)
deleteBtn.addEventListener("click", handleDeleteTodo);
renderTodos();