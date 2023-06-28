import React, { useEffect, useState } from 'react';
import ToDoListContract from './artifacts/contracts/ToDoList.sol/ToDoList.json';
import Web3 from 'web3';
import { getTasks, createTask, toggleCompleted, deleteTask } from './services/ToDoListContractService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [loading, setLoaded] = useState(false);

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
    if (contract) {
      fetchData();
    }
  }, [contract]);


  const fetchData = async () => {
    const result = await getTasks(contract);
    setTasks(result);
  };

  const runCreateTask = async () => {
    const created = await createTask(contract, newTaskContent, defaultAccount);
    if (created) {
      toast.success('Task Created', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      toast.error('Task Fail to Create', {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    setNewTaskContent('');
    fetchData();
  }

  const runToggleCompleted = async (taskId) => {
    await toggleCompleted(contract, taskId, defaultAccount);
    toast.success('Toggle Completed !', {
      position: toast.POSITION.TOP_RIGHT
    });
    fetchData();
  }

  const runDeleteTask = async (taskId) => {
    await deleteTask(contract, taskId, defaultAccount);
    toast.success('Task Deleted!', {
      position: toast.POSITION.TOP_RIGHT
    });
    fetchData();
  }

  

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h1 className="text-center mb-4">To-Do List</h1>
          <Form >
            <Row className="align-items-center">
              <Col xs="8">
                <Form.Control
                  type="text"
                  placeholder="Enter task content"
                  value={newTaskContent}
                  onChange={(e) => {
                    setNewTaskContent(e.target.value);
                  }}
                />
              </Col>
              <Col xs="4">
                <Button onClick={runCreateTask} 
                variant="primary">
                  Add Task
                </Button>
              </Col>
            </Row>
          </Form>
          <ListGroup className="mt-4">
            {tasks.map((task) => (
              <ListGroup.Item key={task.id}>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <span
                      className={task.completed ? 'text-muted text-decoration-line-through' : ''}
                    >
                      {task.content}
                    </span>
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    className="mr-2"
                    onClick={() => runToggleCompleted(task.id)}
                  >
                    {task.completed ? 'Undo' : 'Complete'}
                  </Button>
                  &nbsp;
                  <Button variant="danger" size="sm" onClick={() => runDeleteTask(task.id)}>
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <ToastContainer />
      </Row>
    </Container>
  );
};

export default App;