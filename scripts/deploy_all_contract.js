const hre = require("hardhat");
const fs = require("fs");
// console.log('hre : ', hre);
const ethers = hre.ethers;


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {

    const sig = await hre.ethers.getSigner();
    const accounts = await hre.ethers.getSigners()
    const wallet = accounts[0]

    console.log(wallet.address);
    
    const BitStakerRegistery = await ethers.getContractFactory("BitStakerRegistery", {signer: sig});

    //const bitStakerRegisteryInstance = await BitStakerRegistery.deploy(
    //);

    //await bitStakerRegisteryInstance.deployed();


    // console.log("Bit staker registry deployed at " + bitStakerRegisteryInstance.address);


    // console.log('waiting 30 seconds');
    // await sleep(30000);

    // console.log(bitStakerRegisteryInstance.address);
    // await hre.run("verify:verify", {
    //     contract: 'contracts/BitStakerRegistry.sol:BitStakerRegistery',
    //     address: bitStakerRegisteryInstance.address,
    //     constructorArguments: [],
    // });

    // const GraphProtocol = await ethers.getContractFactory("GraphProtocol");

    // const graphProtocolInstance = await GraphProtocol.deploy(
    // );

    // await graphProtocolInstance.deployed();

    // console.log("Graph protocol ethereum deployed at " + graphProtocolInstance.address);

    // console.log('waiting 30 seconds');
    // await sleep(30000);

    // await hre.run("verify:verify", {
    //     address: graphProtocolInstance.address,
    //     constructorArguments: [
    //     ],
    // });

    // const oneInchProtocol = await ethers.getContractFactory("OneInch");
    // const oneInchProtocolInstance = await oneInchProtocol.deploy(
    // );

    // await oneInchProtocolInstance.deployed();

    // console.log("1Inch protocol ethereum deployed at " + oneInchProtocolInstance.address);

    // console.log('waiting 30 seconds');
    // await sleep(30000);

    // await hre.run("verify:verify", {
    //     address: oneInchProtocolInstance.address,
    //     constructorArguments: [
    //     ],
    // });



    // const ConnectV2AaveV2 = await ethers.getContractFactory("ConnectV2AaveV2");

    // const connectV2AaveV2Instance = await ConnectV2AaveV2.deploy(
    // );

    // await connectV2AaveV2Instance.deployed();

    // console.log("Aave v2 instance deployed at " + connectV2AaveV2Instance.address);

    // console.log('waiting 30 seconds');
    // await sleep(30000);
    // await hre.run("verify:verify", {
    //     address: connectV2AaveV2Instance.address,
    //     constructorArguments: [
    //     ],
    // });

    // const contractAddress = {
    //     BitStakerRegistery: bitStakerRegisteryInstance.address,
    //     GraphProtocol: graphProtocolInstance.address,
    //     oneProtocol: oneInchProtocolInstance.address,
    //     AAVEProtocol: connectV2AaveV2Instance.address
    // };

    // fs.writeFileSync(`${hre.network.name}contract.json`, contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

