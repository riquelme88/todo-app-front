let tasks = document.querySelector('.tasks')
let checkboxTask = document.querySelectorAll('.task input')
const token = localStorage.getItem('token')
let allButton = document.querySelector('#all')
let activeButton = document.querySelector('#active')
let completedButton = document.querySelector('#completed')
let { task, checkbox, p, urlImg, remove, img, resultActives, resultCompletes } = ''

async function getAll() {
    activeButton.classList.remove('active')
    completedButton.classList.remove('active')
    allButton.classList.add('active')
    ////
    if (!token) {
        console.error('Token não encontrado no localStorage');
        return;
    }

    const url = "https://todo-app-back-1.onrender.com/tasks"

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'aplication/json',
            'Authorization': `Bearer ${token}` //Adiciona o token no header Authorization
        }
    })
    if (!response.ok) {
        return
    }

    const data = await response.json()

    tasks.innerHTML = ''
    for (datas in data) {
        let doc = data[datas]

        doc.forEach(item => {
            task = document.createElement('div')
            task.classList.add('task')

            checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.checked = item.completed

            p = document.createElement('p')
            p.classList.add('task-text')
            p.innerHTML = item.task
            if (item.completed) {
                p.style.textDecoration = 'line-through'
            } else {
                p.style.textDecoration = 'none'
            }
            urlImg = 'images/ferramenta-lapis.png'
            img = document.createElement('img')
            img.classList.add('img-pen')
            img.src = urlImg

            remove = document.createElement('div')
            remove.classList.add('remove')
            remove.innerHTML = 'X'

            task.appendChild(checkbox)
            task.appendChild(p)
            task.appendChild(remove)
            task.appendChild(img)
            tasks.appendChild(task)
            ////

            resultActives = doc.filter((item) => { if (!item.completed) return item })
            resultCompletes = doc.filter(item => { if (item.completed) return item })

            completedTask(checkbox, p)
            removeTask(task, remove, p)
            editTask(img, p)
            editFilters(resultActives, task)
        })
    }
}
getAll()

async function getActives() {
    allButton.classList.remove('active')
    completedButton.classList.remove('active')
    activeButton.classList.add('active')
    /////////
    tasks.innerHTML = ''
    resultActives.forEach(item => {
        task = document.createElement('div')
        task.classList.add('task')

        checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = item.completed

        p = document.createElement('p')
        p.classList.add('task-text')
        p.innerHTML = item.task
        if (item.completed) {
            p.style.textDecoration = 'line-through'
        } else {
            p.style.textDecoration = 'none'
        }
        urlImg = 'images/ferramenta-lapis.png'
        img = document.createElement('img')
        img.classList.add('img-pen')
        img.src = urlImg

        remove = document.createElement('div')
        remove.classList.add('remove')
        remove.innerHTML = 'X'

        task.appendChild(checkbox)
        task.appendChild(p)
        task.appendChild(remove)
        task.appendChild(img)
        tasks.appendChild(task)

        completedTask(checkbox, p)
        removeTask(task, remove, p)
        editTask(img, p)
    })
}

async function getCompletes() {
    allButton.classList.remove('active')
    activeButton.classList.remove('active')
    completedButton.classList.add('active')
    ////
    tasks.innerHTML = ''
    resultCompletes.forEach(item => {
        task = document.createElement('div')
        task.classList.add('task')

        checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = item.completed

        p = document.createElement('p')
        p.classList.add('task-text')
        p.innerHTML = item.task
        if (item.completed) {
            p.style.textDecoration = 'line-through'
        } else {
            p.style.textDecoration = 'none'
        }
        urlImg = 'images/ferramenta-lapis.png'
        img = document.createElement('img')
        img.classList.add('img-pen')
        img.src = urlImg

        remove = document.createElement('div')
        remove.classList.add('remove')
        remove.innerHTML = 'X'

        task.appendChild(checkbox)
        task.appendChild(p)
        task.appendChild(remove)
        task.appendChild(img)
        tasks.appendChild(task)

        completedTask(checkbox, p)
        removeTask(task, remove, p)
        editTask(img, p)
    })
}


function completedTask(checkbox, p) {
    checkbox.addEventListener('click', async () => {
        const url = "https://todo-app-back-1.onrender.com/task"
        let task = {
            name: p.innerHTML
        }
        const completed = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(task)
        })
        const response = await completed.json()
        localStorage.setItem('completed', response.updatedTask.completed)
        if (response.updatedTask.completed == true) {
            p.style.textDecoration = 'line-through'
            checkbox.checked = true
            location.reload()
        } else {
            location.reload()
            p.style.textDecoration = 'none'
            checkbox.checked = false
        }
    })
}

function removeTask(task, remove, p) {

    task.addEventListener('mouseover', () => {
        remove.style.display = 'block'
        setTimeout(() => {
            remove.style.opacity = 1
        }, 150)
    })
    task.addEventListener('mouseout', () => {
        setTimeout(() => {
            remove.style.opacity = 0
        }, 1000)
        setTimeout(() => {
            remove.style.display = 'none'
        }, 2000)
    })
    remove.addEventListener('click', async () => {
        const url = "https://todo-app-back-1.onrender.com/task"
        let text = p.innerHTML
        const dados = {
            name: text
        }

        const deleteTask = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        })
        task.remove()
        location.reload()
        const response = await deleteTask.json()
    })
}

let input = document.getElementsByName('task')[0].addEventListener('keydown', (e) => { if (e.key == 'Enter') { addTask() } })

async function addTask() {
    const url = 'https://todo-app-back-1.onrender.com/task'
    input = document.getElementsByName('task')[0].value

    const dados = {
        task: input
    }

    const createTask = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

    const response = await createTask.json()
    if (response.task.task) {
        location.reload()
    }
}

function editTask(penImg, taskText) {
    penImg.addEventListener('click', async () => {

        const url = `https://todo-app-back-1.onrender.com/tasks/${taskText.innerHTML}`
        let input = document.createElement('input')
        input.type = 'text'
        input.classList.add('input-text')
        input.style.marginLeft = '15px'
        input.value = taskText.innerHTML

        taskText.replaceWith(input)
        input.focus()

        input.addEventListener('keydown', async (e) => {
            if (e.key == 'Enter') {
                const dados = {
                    task: input.value
                }
                try {
                    const editTask = await fetch(url, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(dados)
                    })

                    const response = await editTask.json()

                    if (response.updateTask) {
                        taskText.innerHTML = input.value
                        input.replaceWith(taskText)
                    }
                } catch (error) {
                    console.error('Erro ao atualizar a tarefa', error)
                }

            }
        })

        input.addEventListener('blur', () => {
            input.replaceWith(taskText);
        });

    });
}

function editFilters(completes) {
    let itensLeft = document.querySelector('#item span').innerHTML = completes.length + ' '
    let clearCompleted = document.querySelector('#clear')

    clearCompleted.addEventListener('click', async () => {
        const url = 'https://todo-app-back-1.onrender.com/tasks'

        const deleteTask = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const response = await deleteTask.json()
        if (response.tasks.count > 0) { return location.reload() }
    })

}
