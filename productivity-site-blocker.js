// ==UserScript==
// @name         Productivity Site Blocker
// @namespace    https://github.com/sempijja/my-tampermonkey-scripts
// @version      1.0
// @description  Blocks social media during working hours with a countdown and to-do list.
// @author       Ssempijja Charles
// @match        *://x.com/*
// @match        *://www.instagram.com/*
// @match        *://www.threads.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const workingHours = [
        { start: 8, end: 12 },
        { start: 14, end: 17 }
    ];

    function isWorkingHour() {
        let now = new Date();
        let currentHour = now.getHours();
        return workingHours.some(({ start, end }) => currentHour >= start && currentHour < end);
    }

    function getTimeUntilAccess() {
        let now = new Date();
        let currentHour = now.getHours();
        let currentMinutes = now.getMinutes();
        
        let nextAvailableTime = workingHours.reduce((closest, { end }) => {
            return (currentHour < end && end < closest) ? end : closest;
        }, 24);
        
        let remainingHours = nextAvailableTime - currentHour;
        let remainingMinutes = 60 - currentMinutes;
        
        return `${remainingHours}h ${remainingMinutes}m`;
    }

    if (isWorkingHour()) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center;">
                <h1 style="font-size: 24px; color: #ff5252;">🚫 Access Denied During Work Hours</h1>
                <p style="font-size: 18px;">You can access this site in <strong>${getTimeUntilAccess()}</strong></p>
                <h2 style="margin-top: 20px;">✅ Stay Productive - Your To-Do List</h2>
                <div id="todo-container" style="width: 300px; margin-top: 10px;">
                    <input type="text" id="todo-input" placeholder="Add a new task..." style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    <ul id="todo-list" style="list-style: none; padding: 0; margin-top: 10px;"></ul>
                </div>
            </div>
        `;
        
        let todoInput = document.getElementById("todo-input");
        let todoList = document.getElementById("todo-list");
        let todos = JSON.parse(localStorage.getItem("todoItems")) || [];

        function saveTodos() {
            localStorage.setItem("todoItems", JSON.stringify(todos));
        }

        function renderTodos() {
            todoList.innerHTML = "";
            todos.forEach((todo, index) => {
                let li = document.createElement("li");
                li.style.display = "flex";
                li.style.alignItems = "center";
                li.style.justifyContent = "space-between";
                li.style.padding = "5px";
                li.style.borderBottom = "1px solid #ddd";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = todo.completed;
                checkbox.onclick = () => {
                    todos[index].completed = !todos[index].completed;
                    renderTodos();
                    saveTodos();
                };

                let text = document.createElement("span");
                text.innerText = todo.text;
                text.style.textDecoration = todo.completed ? "line-through" : "none";

                let deleteBtn = document.createElement("button");
                deleteBtn.innerText = "❌";
                deleteBtn.style.border = "none";
                deleteBtn.style.background = "transparent";
                deleteBtn.style.cursor = "pointer";
                deleteBtn.onclick = () => {
                    todos.splice(index, 1);
                    renderTodos();
                    saveTodos();
                };

                li.appendChild(checkbox);
                li.appendChild(text);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });
        }

        todoInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter" && todoInput.value.trim() !== "") {
                todos.push({ text: todoInput.value, completed: false });
                todoInput.value = "";
                renderTodos();
                saveTodos();
            }
        });

        renderTodos();
    }
})();
