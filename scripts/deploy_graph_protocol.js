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
  const GraphProtocol = await ethers.getContractFactory("GraphProtocol");

  const graphProtocolInstance = await GraphProtocol.deploy(
  );

  await graphProtocolInstance.deployed();

  console.log("Graph protocol ethereum deployed at " + graphProtocolInstance.address);

  await hre.run("verify:verify", {
    address: graphProtocolInstance.address,
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

  // Graph protocol instance deployed  0xd8e275e1b5A31Fed1Ac75370E4F834f1ce85fCA1
  /**
   * Proxy address: 0x303cb743680ce46ebf6140ae975163612758585f
   * Indexer address : 0xd1dc8604ad129916a1037b6e43e85f0b8af2237d
   * Token Amount : 10000000000000000000 
   * 
   * Userwallet address : 
   * 
   * GRT : 0x54Fe55d5d255b8460fB3Bc52D5D676F9AE5697CD
   * 
   * Generate data : 026e402b000000000000000000000000303cb743680ce46ebf6140ae975163612758585f0000000000000000000000000000000000000000000000008ac7230489e80000
   */
