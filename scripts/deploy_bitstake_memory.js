
const hre = require("hardhat");
const fs = require("fs");
// console.log('hre : ', hre);
const ethers = hre.ethers;


async function main() {

    const BitStakeMemory= await ethers.getContractFactory("BitStakeMemory");

    const bitStakeMemoryInstance = await BitStakeMemory.deploy(
    );

    await bitStakeMemoryInstance.deployed();
    
  console.log('bitstake memory  '+bitStakeMemoryInstance.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });