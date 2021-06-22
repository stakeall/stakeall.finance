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
async function main() {
  const ConnectV2AaveV2 = await ethers.getContractFactory("ConnectV2AaveV2");

  const connectV2AaveV2Instance = await ConnectV2AaveV2.deploy(
  );

  await connectV2AaveV2Instance.deployed();

  console.log("Aave v2 instance deployed at " + connectV2AaveV2Instance.address);

  await hre.run("verify:verify", {
    address: connectV2AaveV2Instance.address,
    constructorArguments: [
    ],
  });


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
