// DOM elements
const todoForm = document.querySelector('#todo-form')
const todoList = document.querySelector('.todos')
const totalTasks = document.querySelector('#total-tasks')
const completedTasks = document.querySelector('#completed-tasks')
const remainingTasks = document.querySelector('#remaining-tasks')
const mainInput = document.querySelector('#todo-form input')
let tasks = JSON.parse(localStorage.getItem('tasks')) || []



// If there are tasks in local storage, create them in the page
if (localStorage.getItem('tasks')) {
	tasks.map((task) => {
		createTask(task)
	})
}



// Main form submission
todoForm.addEventListener('submit', (e) => {
	// Prevent default form submission
	e.preventDefault()

	// Get the input value
	const inputValue = mainInput.value

	if (inputValue == '') {
		return
	}

	// Create the task object
	const task = {
		id: new Date().getTime(),
		name: inputValue,
		isCompleted: false
	}

	// Add the task object to the tasks array and set them in local storage
	tasks.push(task)
	localStorage.setItem('tasks', JSON.stringify(tasks))

	// Create the task in the page
	createTask(task)

	// Reset the form and focus it
	todoForm.reset()
	mainInput.focus()
})



// Removing a task
todoList.addEventListener('click', (e) => {
	if (e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || e.target.parentElement.parentElement.classList.contains('remove-task')) {
		// Get the task id
		const taskId = e.target.closest('li').id

		// Call the function
		removeTask(taskId)
	}
})



// Updating a task
todoList.addEventListener('input', (e) => {
	// Get the task id
	const taskId = e.target.closest('li').id

	// Call the function
	updateTask(taskId, e.target)
})



// Prevent new lines with enter
todoList.addEventListener('keydown', (e) => {
	if (e.keyCode === 13) {
		e.preventDefault()

		// Remove the focus
		e.target.blur()
	}
})



// Function for creating a task
function createTask(task) {
	// Create a new li element
	const taskEl = document.createElement('li')

	// Set the ID of the element
	taskEl.setAttribute('id', task.id)

	// If the task is completed, set the correct class
	if (task.isCompleted) {
		taskEl.classList.add('complete')
	}

	// Create the element markup
	const taskElMarkup = `
		<div>
			<input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
			<span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
		</div>
		<button title="Remove the "${task.name}" task" class="remove-task">
			<svg viewBox="0 0 24 24" fill="none">
				<path d="M17.25 17.25L6.75 6.75" stroke="#A4D0E3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M17.25 6.75L6.75 17.25" stroke="#A4D0E3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	`

	taskEl.innerHTML = taskElMarkup

	// Add the new element to the task list in the page
	todoList.appendChild(taskEl)

	// Count the tasks
	countTasks()
}



// Function for counting tasks
function countTasks() {
	// Determine how many tasks are completed
	const completedTasksArray = tasks.filter((task) => task.isCompleted === true)

	// Update the text elements
	totalTasks.textContent = tasks.length
	completedTasks.textContent = completedTasksArray.length
	remainingTasks.textContent = tasks.length - completedTasksArray.length
}



// Function for deleting a task
function removeTask(taskId) {
	// Filter out the task with the deleted id
	tasks = tasks.filter((task) => task.id !== parseInt(taskId))

	// Update the new tasks in local storage
	localStorage.setItem('tasks', JSON.stringify(tasks))

	// Remove the task from the page
	document.getElementById(taskId).remove()

	// Re-count the tasks
	countTasks()
}



// Function for updating a task
function updateTask(taskId, el) {
	// Find the right task
	const task = tasks.find((task) => task.id === parseInt(taskId))

	// If the task name is editable, we get the new content
	// Otherwise, it means the checkbox was clicked
	if (el.hasAttribute('contenteditable')) {
		task.name = el.textContent
	} else {
		const span = el.nextElementSibling
		const parent = el.closest('li')

		task.isCompleted = !task.isCompleted

		if (task.isCompleted) {
			span.removeAttribute('contenteditable')
			parent.classList.add('complete')
		} else {
			span.setAttribute('contenteditable', '')
			parent.classList.remove('complete')
		}
	}

	// Save the updated task in local storage
	localStorage.setItem('tasks', JSON.stringify(tasks))

	// Count the tasks
	countTasks()
}