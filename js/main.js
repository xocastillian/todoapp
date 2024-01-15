// Получаем ссылки на HTML-элементы
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

// Инициализируем массив задач, если он уже есть в localStorage
let tasks = []

// Проверяем, есть ли сохраненные задачи в localStorage
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	// Для каждой сохраненной задачи рендерим ее на страницу
	tasks.forEach(task => renderTask(task))
}

// Функция для добавления задачи
const addTask = event => {
	event.preventDefault()

	// Получаем значение из поля ввода
	const taskInputValue = taskInput.value

	// Создаем новую задачу
	const newTask = {
		id: Date.now(),
		text: taskInputValue,
		done: false,
	}

	// Добавляем задачу в массив
	tasks.push(newTask)

	// Рендерим новую задачу на страницу
	renderTask(newTask)

	// Очищаем поле ввода и фокусируем на нем
	taskInput.value = ''
	taskInput.focus()

	// Проверяем, нужно ли показывать пустой список
	checkEmptyList()

	// Сохраняем задачи в localStorage
	saveToLS()
}

// Функция для удаления задачи
const deleteTask = event => {
	// Проверяем, что кликнули по кнопке "delete"
	if (event.target.dataset.action !== 'delete') return

	// Находим родительский элемент задачи (li)
	const parentNode = event.target.closest('li')
	const id = parentNode.id

	// Находим индекс задачи в массиве по id
	const index = tasks.findIndex(task => task.id == id)

	// Удаляем задачу из массива
	tasks.splice(index, 1)

	// Удаляем задачу из DOM
	parentNode.remove()

	// Проверяем, нужно ли показывать пустой список
	checkEmptyList()

	// Сохраняем задачи в localStorage
	saveToLS()
}

// Функция для отметки задачи выполненной
const doneTask = event => {
	// Проверяем, что кликнули по кнопке "done"
	if (event.target.dataset.action !== 'done') return

	// Находим родительский элемент задачи (li)
	const parentNode = event.target.closest('li')
	const id = parentNode.id

	// Находим задачу в массиве по id
	const task = tasks.find(task => task.id == id)

	// Инвертируем значение свойства "done"
	task.done = !task.done

	// Добавляем/удаляем класс в зависимости от значения "done"
	parentNode.querySelector('span').classList.toggle('task-title--done')

	// Сохраняем задачи в localStorage
	saveToLS()
}

// Функция для проверки, нужно ли показывать пустой список
function checkEmptyList() {
	// Если задач нет, добавляем пустой элемент
	if (tasks.length === 0) {
		const emptyListHTML = `
      <li id="emptyList" class="list-group-item empty-list">
        <div class="empty-list__title">Список задач пуст</div>
      </li>
    `
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
	}

	// Если задачи есть, удаляем пустой элемент
	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}
}

// Функция для сохранения задач в localStorage
const saveToLS = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Функция для рендеринга задачи на страницу
function renderTask(task) {
	// Определяем класс для стилей в зависимости от значения "done"
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

	// Генерируем HTML для задачи
	const taskHtml = `
    <li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${task.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>
  `

	// Вставляем HTML в конец списка задач
	tasksList.insertAdjacentHTML('beforeend', taskHtml)
}

// Добавляем обработчики событий
form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
checkEmptyList()