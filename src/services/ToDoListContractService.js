
export const getTasks = async (contract) => {
    console.log("Call get task functions");
    if (contract) {
      try {
        const result = await contract.methods.getAllTasks().call();
        // setTasks(result);
        console.log(result);
        return result;
      } catch (error) {
        console.error(error);
      }
    }
};

export const createTask = async (contract, newTaskContent, defaultAccount) => {
  if (contract) {
    try {
      console.log("creating task...");
      await contract.methods.createTask(newTaskContent).send({ from: defaultAccount });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};

export const toggleCompleted = async (contract, taskId, defaultAccount) => {
  if (contract) {
    try {
      await contract.methods.toggleCompleted(taskId).send({ from: defaultAccount });
      return true;
      
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const deleteTask = async (contract, taskId, defaultAccount) => {
  if (contract) {
    try {
      await contract.methods.removeTask(taskId).send({ from: defaultAccount });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};

// export const createTask = async (contract) => {
//     if (contract) {
//       try {
//         await contract.methods.createTask(newTaskContent).send({ from: defaultAccount });
//         setNewTaskContent('');
//         getTasks();
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };