let input = document.querySelector('.input');
let addBtn = document.querySelector('.add');
let clearBtn = document.querySelector('.clear');
let secondClearBtn = document.querySelector(".clearCompleted");
let tasksDiv = document.querySelector(".currentTasks");
let doneTasksDiv = document.querySelector(".doneTasks");
let tasksList = [];
let doneTasksList = [];
let draggableTask;
let tasksType;

// Check if there are Ongoing Tasks in the LocalStorage
if (window.localStorage.getItem('tasks')) {
  tasksList = JSON.parse(window.localStorage.getItem('tasks'));
  tasksType = "todo";
  addTask(tasksList, tasksType);
}

// Check if there are Completed Tasks in LocalStorage
if (window.localStorage.getItem("doneTasks")) {
  doneTasksList = JSON.parse(window.localStorage.getItem("doneTasks"));
  tasksType = "done";
  addTask(doneTasksList, tasksType);
}

clearBtn.onclick = function () {
  tasksList = [];
  tasksDiv.innerHTML = "";
  window.localStorage.removeItem("tasks");
};

secondClearBtn.onclick = function () {
  doneTasksList = [];
  doneTasksDiv.innerHTML = "";
  window.localStorage.removeItem("doneTasks");
};

addBtn.onclick = function () {
  if (input.value.trim() !== "") {
    const taskObject = {
      id: Date.now(),
      title: input.value.trim(),
    };
    if (window.localStorage.getItem("tasks")) {
      tasksList = JSON.parse(window.localStorage.getItem("tasks"));
    }
    tasksList.push(taskObject);
    addTask(tasksList, "todo");
  }
  drag();
};

// Add the task to page and local storage at the same time
function addTask(arr, tasksType) {
  let theDiv;
  if (tasksType === "todo") {
    arr = tasksList;
    theDiv = tasksDiv;
  } else if (tasksType === "done") {
    arr = doneTasksList;
    theDiv = doneTasksDiv;
  }
  // Empty the tasks div each time when we try to add any task to prevent adding any dublicated tasks
  if (arr.length > 0) {
    theDiv.innerHTML = "";
  }
  // Add the task to page
  arr.forEach((t) => {
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("id", t.id);
    taskContainer.className = "task";
    if (tasksType === "todo") {
      taskContainer.setAttribute("draggable", "true"); // very important
    } else if (tasksType === "done") {
      taskContainer.classList.add("done");
    }
    let task = document.createElement("p");
    task.textContent = t.title;
    let delBtn = document.createElement("button");
    delBtn.textContent = "x";
    taskContainer.append(task);
    taskContainer.append(delBtn);
    theDiv.append(taskContainer);
    // Add the task to the LocalStorage
    if (tasksType === "todo") {
      window.localStorage.setItem("tasks", JSON.stringify(arr));
    } else if (tasksType === "done") {
      window.localStorage.setItem("doneTasks", JSON.stringify(arr));
    }
    // Empty the input field each time after adding a task
    input.value = "";
    // Delete the task from each of the page and the LocalStorage
    delBtn.onclick = function () {
      this.parentNode.remove();
      if (tasksType === "todo") {
        arr = JSON.parse(window.localStorage.getItem("tasks"));
        arr = arr.filter((task) => task.id != this.parentNode.id);
        window.localStorage.setItem("tasks", JSON.stringify(arr));
      } else if (tasksType === "done") {
        arr = JSON.parse(window.localStorage.getItem("doneTasks"));
        arr = arr.filter((task) => task.id != this.parentNode.id);
        window.localStorage.setItem("doneTasks", JSON.stringify(arr));
      }
    };
  });
}

function drag() {
  let draggableTasks = document.querySelectorAll(".task");
  draggableTasks.forEach((task) => {
    task.addEventListener("dragstart", function () {
      draggableTask = this;
      task.style.opacity = "0.5";
    });
    task.addEventListener("dragend", function () {
      afterDrop();
      task.style.opacity = "1";
    });
  });

  doneTasksDiv.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.style.borderStyle = "dashed";
    this.style.borderWidth = "5px";
    this.style.padding = "0 0 50px";
    this.style.transform = "ScaleY(1.2)";
  });
  
  doneTasksDiv.addEventListener("dragleave", function () {
    this.style.borderStyle = "none";
    this.style.borderWidth = "0";
    this.style.padding = "10px";
    this.style.transform = "ScaleY(1)";
  });
  
  doneTasksDiv.addEventListener("drop", function () {
    this.append(draggableTask);
    tasksList = JSON.parse(window.localStorage.getItem("tasks"));
    tasksList = tasksList.filter((task) => task.id != draggableTask.id);
    window.localStorage.setItem("tasks", JSON.stringify(tasksList));
    this.style.borderStyle = "none";
    this.style.borderWidth = "0";
    this.style.padding = "10px";
    this.style.transform = "ScaleY(1)";
  });
}
drag();

function afterDrop() {
  Array.from(doneTasksDiv.children).forEach((task) => {
    const taskObject = {
      id: task.id,
      title: task.children[0].innerHTML.trim(),
    };
    if (window.localStorage.getItem("doneTasks")) {
      doneTasksList = JSON.parse(window.localStorage.getItem("doneTasks"));
    }
    let exist = false;
    for (let i = 0; i < doneTasksList.length; i++) {
      if (doneTasksList[i].id === taskObject.id) {
        exist = true
        break;
      }
    }
    if (!exist) {
      doneTasksList.push(taskObject);
    }
  });
  doneTasksDiv.innerHTML = "";
  addTask(doneTasksList, "done");
  window.localStorage.setItem("doneTasks", JSON.stringify(doneTasksList));
}