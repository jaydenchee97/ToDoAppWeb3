// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import { console } from "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ToDoList {
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 id, string content);
    event TaskCompleted(uint256 id, bool completed);
    event TaskRemove(uint256 id);

    constructor() public {
        createTask("My First Task");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content);
    }

    function toggleCompleted(uint256 _id) public {
        Task storage task = tasks[_id];
        task.completed = !task.completed;
        emit TaskCompleted(_id, task.completed);
    }

    function removeTask(uint256 _id) public {
        require(_id <= taskCount, "Invalid task ID");

        // Delete the task from the mapping
        delete tasks[_id];

        // Reorganize the tasks mapping
        for (uint256 i = _id + 1; i <= taskCount; i++) {
            tasks[i - 1] = tasks[i];
        }
        
        // Clear the last element
        delete tasks[taskCount];
        
        // Decrement the task count
        taskCount--;

        emit TaskRemove(_id);
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](taskCount);
        for (uint256 i = 1; i <= taskCount; i++) {
            allTasks[i - 1] = tasks[i];
        }
        return allTasks;
    }

}