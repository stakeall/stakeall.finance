// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
// console.log('hre : ', hre);
const ethers = hre.ethers;
const config = require('./config.json');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const BitStakerRegistery = await ethers.getContractFactory("BitStakerRegistery");

  const bitStakerRegisteryInstance = await BitStakerRegistery.deploy(
  );

  await bitStakerRegisteryInstance.deployed();


  console.log("Bit staker registry deployed at " + bitStakerRegisteryInstance.address);


  console.log('waiting 30 seconds');
  await sleep(30000);

  console.log(bitStakerRegisteryInstance.address);
  await hre.run("verify:verify", {
    contract: 'contracts/BitStakerRegistry.sol:BitStakerRegistery',
    address: bitStakerRegisteryInstance.address,
    constructorArguments: [],
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // Deployed BitStakerRegistry at  0xD2Ef9c321E13D7722Eab65969252847f0A6e2d96
