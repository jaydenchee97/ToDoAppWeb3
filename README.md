# To Do List Application

This is a simple To Do List Application build by using React, Solidity, Web3, Bootstrap techstack.

## Prerequisite

Before starting the application, run npm install to install the requied node package module.
You also need a wallet before running the application.

```bash
npm install
```

## Hardhat

This project requires to use hardhat to compile and release the contract to the network. 
In this example, the contract will be compile and release on the local network.


```bash
npx hardhat compile

npx hardhat node

npx hardhat run scripts/deploy.js --network localhost

```