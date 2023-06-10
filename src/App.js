import React, { useEffect, useState } from 'react';
import ToDoListContract from './artifacts/contracts/ToDoList.sol/ToDoList.json';
import Web3 from 'web3';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setDefaultAccount(accounts[0]);
        console.log(accounts[0]);

        const contractABI = ToDoListContract.abi;
        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
        console.log(contractInstance);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getTasks();
    };

    if (contract) {
      fetchData();
    }
  }, [contract]);

  const getTasks = async () => {
    if (contract) {
      try {
        const result = await contract.methods.getAllTasks().call();
        setTasks(result);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const createTask = async () => {
    if (contract) {
      try {
        await contract.methods.createTask(newTaskContent).send({ from: defaultAccount });
        setNewTaskContent('');
        getTasks();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleCompleted = async (taskId) => {
    if (contract) {
      try {
        await contract.methods.toggleCompleted(taskId).send({ from: defaultAccount });
        getTasks();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    if (contract) {
      try {
        await contract.methods.removeTask(taskId).send({ from: defaultAccount });
        getTasks();
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  

  return (
    <div>
      <h1>ToDoList Application</h1>

      <div>
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="Enter task content"
        />
        <button onClick={createTask}>Add Task</button>
      </div>

      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span>{task.content}</span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(task.id)}
              />
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;