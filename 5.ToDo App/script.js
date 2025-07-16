let list = document.querySelector(".list");
let addIcon = document.querySelector("#addIcon");
let checkBox = document.querySelectorAll('input[type="checkbox"]');
let task = document.querySelectorAll('.task');
let Label = document.querySelectorAll('.task label');
let form = document.querySelector('.addTask');
let crossIcon = document.querySelector("#cross");
let taskInput = document.querySelector('#taskInput');
let addTaskBtn = document.querySelector('#addTaskBtn')

showDate();

addIcon.addEventListener("click", () => {
    form.style.display = "block";

})
crossIcon.addEventListener("click", () => {
    form.style.display = "none";
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (taskInput.value.trim() === '') {
        alert("⚠️ Please enter a task before adding.");
        return;
    }
    createTask();
    totalNpendingTasks();
    form.style.display = "none";
})



let taskId = 1;
function createTask() {

    let taskDiv = document.createElement('div');
    taskDiv.className = "task";

    let checkBox = document.createElement('input');
    checkBox.type = "checkbox"
    checkBox.name = taskId;
    checkBox.id = taskId;

    let label = document.createElement('label');
    label.className = "taskLabel"
    label.htmlFor = taskId;
    label.textContent = taskInput.value;

    // Save to local storage////////////////
    const taskObj = {
        id: taskId,
        text: label.textContent,
        completed: false
    };

    const tasks = getTasks();
    tasks.push(taskObj);
    saveTasks(tasks);
    ///////////////////////////////////////

    taskInput.value = '';


    loadTasks();
    taskId++;


    checkBox.addEventListener("click", (e) => {
        label.classList.toggle('completed');
        e.stopPropagation();
    });

}



function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // console.log("changes saved!");
}
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}


function loadTasks() {
    list.innerHTML = '';

    const initialText = document.createElement('h2');
    initialText.id = 'initialText';
    initialText.textContent = 'No tasks yet!';
    list.appendChild(initialText);

    const tasks = getTasks();

    document.querySelector('#initialText').style.display = tasks.length === 0 ? "block" : "none";
    tasks.forEach(task => {
        let taskDiv = document.createElement('div');
        taskDiv.className = "task";

        let checkBox = document.createElement('input');
        checkBox.type = "checkbox"
        checkBox.name = task.id;
        checkBox.id = task.id;
        checkBox.checked = task.completed;

        let label = document.createElement('label');
        label.className = "taskLabel"
        label.htmlFor = task.id;
        label.textContent = task.text;
        if (task.completed) {
            label.classList.add('completed')
        };

        taskDiv.appendChild(checkBox);
        taskDiv.appendChild(label);

        list.appendChild(taskDiv);

        checkBox.addEventListener("click", (e) => {
            label.classList.toggle('completed');
            // Update local storage when checkbox is toggled///////////////////
            task.completed = checkBox.checked;
            const tasks = getTasks();
            const idx = tasks.findIndex((t) => { return t.id === task.id });
            if (idx > -1) {
                tasks[idx].completed = checkBox.checked;
                saveTasks(tasks);
                totalNpendingTasks();
            }
            e.stopPropagation();
        });
    });
    // Update taskId to avoid duplicate IDs////////////////////////////////
    if (tasks.length > 0) {
        taskId = tasks[tasks.length - 1].id + 1;
    }

    totalNpendingTasks();

}

function totalNpendingTasks() {
    //Display the total And Pending Tasks ///////////////////
    const tasks = getTasks();
    let total_Task = tasks.length;
    let pending_Task = (tasks.filter((e) => { return e.completed === false })).length;
    document.querySelector('.totalTask').textContent = `Tasks : ${total_Task}`;
    document.querySelector('.pending').textContent = `Pending : ${pending_Task}`
}


loadTasks();


let optIcon = document.querySelector('#optIcon');
let menuBox = document.querySelector('#moreOpt');
optIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    menuBox.classList.toggle('appear');
});

document.addEventListener("click", (e) => {
    if (!optIcon.contains(e.target)) {
        menuBox.classList.remove('appear');
    }
});

document.querySelector('#opt1').addEventListener("click", () => {
    localStorage.clear();
    loadTasks();
})

function showDate() {
    let today = new Date();

    let dayName = today.toLocaleString('default', { weekday: 'long' });
    let date = today.getDate()
    let monthName = today.toLocaleString('default', { month: 'long' });
    let year = today.getFullYear()
    let minutes = today.getMinutes().toString().padStart(2, '0')
    let hrs = today.getHours().toString().padStart(2, '0')

    document.querySelector('.date').innerHTML = `${dayName}, ${date} ${monthName} ${year}, ${hrs}:${minutes}`;

}