// import React, { useState } from 'react'
// import './Todo.css'

// function Todo() {
//   const [inputValue, setInputValue] = useState('')
//   const [todos, setTodos] = useState([])
//   const [editIndex, setEditIndex] = useState(null)

//   function handleSubmit() {
//     if (inputValue.trim() === '') return

//     if (editIndex === null) {
//       setTodos([...todos, inputValue])
//     } else {
//       setTodos(todos.map((t, i) => i === editIndex ? inputValue : t))
//       setEditIndex(null)
//     }

//     setInputValue('')
//   }

//   function deleteTodo(index) {
//     setTodos(todos.filter((_, i) => i !== index))
//   }

//   function startEdit(index) {
//     setEditIndex(index)
//     setInputValue(todos[index])
//   }

//   return (
//     <div className="todo-container">
//         <h1>Todo List</h1>
//       <input
//         className="todo-input"
//         type="text"
//         placeholder="Add or edit a todo"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />

//       <button className="todo-button" onClick={handleSubmit}>
//         {editIndex === null ? 'Add' : 'Save'}
//       </button>

//       {todos.map((todo, index) => (
//         <div key={index} className="todo-item">
//           {todo}
//           <div>
//             <button onClick={() => deleteTodo(index)}>Delete</button>
//             <button className="edit-button" onClick={() => startEdit(index)}>Edit</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default Todo

import React, { useState } from 'react'
import './Todo.css'

function Todo() {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [lastInsertedId, setLastInsertedId] = useState('')

  // Part 1: Get the user's location
  const geoFindMe = (id) => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
      locateTask(id, {
        latitude: '##',
        longitude: '##',
        error: 'Geolocation not supported',
      })
      return
    }

    console.log('Locating...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        console.log(latitude, longitude)
        console.log(
          `Latitude: ${latitude}, Longitude: ${longitude}`
        )
        console.log(
          `Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
        )

        locateTask(id, {
          latitude,
          longitude,
          error: '',
        })
      },
      () => {
        console.log('Unable to retrieve your location')
        locateTask(id, {
          latitude: '##',
          longitude: '##',
          error: 'Unable to retrieve location',
        })
      }
    )
  }

  // Part 2: Add a new todo
  function handleSubmit() {
    if (inputValue.trim() === '') return

    if (editIndex !== null) {
      setTodos(
        todos.map((todo, index) =>
          index === editIndex
            ? { ...todo, name: inputValue }
            : todo
        )
      )
      setEditIndex(null)
    } else {
      const id = 'todo-' + Date.now()

      const newTodo = {
        id: id,
        name: inputValue,
        completed: false,
        location: {
          latitude: '##',
          longitude: '##',
          error: 'Pending',
        },
      }

      setLastInsertedId(id)
      setTodos([...todos, newTodo])

      // Request location for this specific todo
      geoFindMe(id)
    }

    setInputValue('')
  }

  // Part 3: Update the location of the correct todo
  function locateTask(id, location) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, location: location }
          : todo
      )
    )
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  function startEdit(id) {
    const index = todos.findIndex((todo) => todo.id === id)
    if (index === -1) return

    setEditIndex(index)
    setInputValue(todos[index].name)
  }

  return (
    <div className="todo-container">
      <h1>Geo Todo List</h1>

      <input
        className="todo-input"
        type="text"
        placeholder="Add or edit a todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <button className="todo-button" onClick={handleSubmit}>
        {editIndex === null ? 'Add' : 'Save'}
      </button>

      {todos.map((todo) => (
        <div key={todo.id} className="todo-item">
          <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                setTodos((currentTodos) =>
                  currentTodos.map((item) =>
                    item.id === todo.id
                      ? { ...item, completed: !item.completed }
                      : item
                  )
                )
              }
            />

            <strong>{todo.name}</strong>

            <div>
              Latitude: {todo.location.latitude}
              {' | '}
              Longitude: {todo.location.longitude}
            </div>

            {todo.location.error && (
              <div>{todo.location.error}</div>
            )}
          </div>

          <div>
            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>

            <button
              className="edit-button"
              onClick={() => startEdit(todo.id)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Todo
