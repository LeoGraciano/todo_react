import './App.css'
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';

const API = 'http://localhost:5000';
const url_db = API + "/todos/"

async function connect_db(url, options) {

  let res = await fetch(url, options).then(
      (res) => res.json()
    ).then(
      (data) => data
    ).catch(
      (err) => console.log(err)
  );
  return res;
}

function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const loadData = async (e) => { 

      setLoading(true)

    const res = await fetch(url_db).then(
      (res) => res.json()
    ).then(
      (data) => data
    ).catch(
      (err) => console.log(err)
  );

    setTodos(res)

    setLoading(false)

    }
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    };


    const option = {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    };

    connect_db(url_db, option);

    setTodos((prevState) => [...prevState, todo]); 

    setTitle("")
    setTime("")
  }

  const handleDelete = (id) => { 
    const options = {
      method: "DELETE",
    }
    const url_db_obj = url_db + id;
    connect_db(url_db_obj, options);

    setTodos((prevState) => prevState.filter((todo) => todo.id!== id))
  }

  const handleEdit = (todo) => { 
    todo.done = !todo.done;

    const options = {
      method: "PUT",
      body: JSON.stringify(todo), 
      headers: {
        "Content-Type": "application/json",
      }
    }

    const url_db_obj = url_db + todo.id;

    const data = connect_db(url_db_obj, options);

    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (data) : t)));
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua proxima tarefa:</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que voce vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder='Título da tarefa'
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""} 
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="title">Duração:</label>
            <input
              type="number"
              name="time"
              placeholder='Tempo estimado (em horas)'
              onChange={(e) => setTime(e.target.value)}
              value={time || ""} 
              required
            />
          </div>
          <button type="submit">Criar Tarefa</button>
        </form>

      </div>
      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Nenhum Tarefas disponíveis</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="action">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
