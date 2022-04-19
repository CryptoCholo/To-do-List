const projectsContainer = document.querySelector('[data-projects]');
const newProjectForm = document.querySelector('[data-new-project-form');
const newProjectInput = document.querySelector('[data-new-project-input]');
const newProjectButton = document.querySelector('[data-new-project-button]');
const newProjectContainer = document.querySelector('[data-new-project-container]');
const newProjectClearBtn = document.querySelector('[data-new-project-clear-btn]');
const tasksDisplayContainer = document.querySelector('[data-tasks-display-container]');
const newTaskButton = document.querySelector('[data-new-task-button]');
const newTasksContainer = document.querySelector('[data-new-tasks-container]');
const taskTitleElement = document.querySelector('[data-task-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const closetaskFormBtn = document.querySelector('[data-close-task-form]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskAddBtn = document.querySelector('[data-new-task-addbtn]');
const taskListItem = document.querySelector('[data-tasklist-item]');
const taskPriority = document.querySelector('[data-new-task-priority]');



const STORAGE_PROJECT_KEY = 'projects.list';
const STORAGE_SELECTED_LIST_ID_KEY = 'projects.selectedListId';


let projects = JSON.parse(localStorage.getItem(STORAGE_PROJECT_KEY))  || [];
let selectedListId = localStorage.getItem(STORAGE_SELECTED_LIST_ID_KEY);


render();

projectsContainer.addEventListener('click', (e) => {
    if (e.target.nodeName.toLowerCase() === 'div') {
        selectedListId = e.target.parentNode.dataset.projectId;
        saveAndRender();
    }
    if (e.target.nodeName.toLowerCase() === 'span') {
       projects = projects.filter(project => project.title !== e.target.previousElementSibling.innerText)
       selectedListId = null;
       saveAndRender();
    }
})

newProjectButton.addEventListener('click',  (e) => {
    newProjectContainer.style.display = 'flex';
})

newProjectForm.addEventListener('click', (e) => {
    if (e.target.innerText === 'add') {
        const projectName = newProjectInput.value.toLowerCase();
        if (projectName === null || projectName === '') {return}
        const project  = createProject(projectName)
        newProjectInput.value = null
        projects.push(project)
        saveAndRender();
    }
})

newProjectClearBtn.addEventListener('click', (e) => {
    newProjectContainer.style.display = 'none';
})

tasksContainer.addEventListener('click', (e) => {
    console.log(e);
    if (e.target.innerText.toLowerCase() === 'delete') {
        console.log('a');
        projects.forEach(project => {
            if ( project.id === selectedListId) {
                console.log('b');
            project.tasks = project.tasks.filter(task => task.title !== e.target.previousElementSibling.lastElementChild.innerText)
                console.log('c');
            }
        })
        saveAndRender();
        console.log('d');
     }
})


newTaskButton.addEventListener('click', (e) => {
    newTasksContainer.style.display = 'flex';
})

newTaskAddBtn.addEventListener('click', (e) => {
    const taskTitle = document.querySelector('[data-new-task-title]').value.toLowerCase();
    const taskDesc = document.querySelector('[data-new-task-desc]').value.toLowerCase();
    const taskDate = document.querySelector('[data-new-task-date]').value;
   
   
    const newTask = new TaskFactory(taskTitle, taskDesc, taskPriority, taskDate);

    if (newTask.title === null || newTask.title === '') {
             return 
    } else {
            projects.forEach( project => {
            if ( project.id === selectedListId) {
                project.tasks.push(newTask);
                saveAndRender();
            };
        })
    }
})

taskPriority.addEventListener('click', (event) => {
    event.target.style.border = '1px solid black';
})


closetaskFormBtn.addEventListener('click', (e) =>{
    newTasksContainer.style.display = 'none';
})

class TaskFactory  {
    constructor(title, description, priority, dueDate, project) {
        this.title = title;
        this.desc = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.project = project;
        this.id = Math.floor((Math.random() * 1000) + 1);
    }   
}

function createProject(name) {
    return { id: Date.now().toString(), title: name, tasks: []}
}

function saveAndRender() {
    save();
    render();
}

function resetForm() {
    document.querySelector('[data-new-task-title]').value = null;
    document.querySelector('[data-new-task-desc]').value = null;
    document.querySelector('[data-new-task-priority]').value = null;
    document.querySelector('[data-new-task-date]').value = null;
}

function save() {
    localStorage.setItem(STORAGE_PROJECT_KEY, JSON.stringify(projects));
    localStorage.setItem(STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}


function render() {
    clearElement(projectsContainer)
    renderProjects();
    resetForm();
    renderTasksPanel();
}

function renderTasksPanel() {
     projects.forEach( project => {
        if ( project.id === selectedListId) {
            return taskHeader = project; 
        };
    });
    if (selectedListId == null) {
        tasksDisplayContainer.style.display = 'none';
    } else {
        tasksDisplayContainer.style.display = '';
        taskTitleElement.innerText = taskHeader.title;
        clearElement(tasksContainer);
        displaytasks(taskHeader);
    }
}

function displaytasks(tasktitle ) {
    tasktitle.tasks .forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-name');
        const divTask = document.createElement('div');
        const firstIcon = document.createElement('span');
        firstIcon.classList.add('material-icons');
        firstIcon.innerText = 'check_circle';
        divTask.appendChild(firstIcon);
        const taskText = document.createElement('span');
        taskText.innerText = task.title;
        divTask.appendChild(taskText);
        taskItem.appendChild(divTask);
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('material-icons');
        deleteIcon.innerText = 'delete';
        taskItem.appendChild(deleteIcon);
        tasksContainer.appendChild(taskItem);
    })
}


function renderProjects() {
    projects.forEach(project => {
        const projectElement = document.createElement('li')
        projectElement.dataset.projectId = project.id;
        projectElement.classList.add('project-name')
        const projectElementText = document.createElement('div');
        projectElementText.innerText = project.title;
        projectElement.appendChild(projectElementText)
        const elementIcon = document.createElement('span')
        elementIcon.classList.add('material-icons')
        elementIcon.innerText = 'delete';
        projectElement.appendChild(elementIcon)
        if (project.id === selectedListId)  {
            projectElementText.classList.add('active-list')
        }
        projectsContainer.appendChild(projectElement);
        newProjectContainer.style.display = 'none';  
    })
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
