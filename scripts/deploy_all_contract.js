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

    console.log(hre.network.name);
    const sig = await hre.ethers.getSigner();
    const accounts = await hre.ethers.getSigners()
    const address = accounts[0].address
    
    const BitStakerRegistery = await ethers.getContractFactory("BitStakerRegistery",{}, sig);

    const bitStakerRegisteryInstance = await BitStakerRegistery.deploy(
    );

    await bitStakerRegisteryInstance.deployed();


    const GraphProtocol = await ethers.getContractFactory("GraphProtocol");

    const graphProtocolInstance = await GraphProtocol.deploy(
    );

    await graphProtocolInstance.deployed();

     console.log("Graph protocol ethereum deployed at " + graphProtocolInstance.address);

     const oneInchProtocol = await ethers.getContractFactory("OneInch");
    const oneInchProtocolInstance = await oneInchProtocol.deploy(
    );

     await oneInchProtocolInstance.deployed();

      console.log("1Inch protocol ethereum deployed at " + oneInchProtocolInstance.address);

    // console.log('waiting 30 seconds');
    // await sleep(30000);

    // await hre.run("verify:verify", {
    //     address: oneInchProtocolInstance.address,
    //     constructorArguments: [
    //     ],
    // });

    const ConnectV2AaveV2 = await ethers.getContractFactory("ConnectV2AaveV2");

    const connectV2AaveV2Instance = await ConnectV2AaveV2.deploy(
    );

      await connectV2AaveV2Instance.deployed();

     console.log("Aave v2 instance deployed at " + connectV2AaveV2Instance.address);

    // console.log('waiting 30 seconds');
    // await sleep(30000);
    // await hre.run("verify:verify", {
    //     address: connectV2AaveV2Instance.address,
    //     constructorArguments: [
    //     ],
    // });


    const FundGateway = await ethers.getContractFactory("FundGateway");

    const fundGatewayInstance = await FundGateway.deploy(
    );

      await fundGatewayInstance.deployed();

     console.log("Fund Gateway deployed at " + fundGatewayInstance.address);
    

    await bitStakerRegisteryInstance.functions.build();

    const userWalletAddress = await bitStakerRegisteryInstance.functions.proxies(address);
    
    await bitStakerRegisteryInstance.functions.enableLogic(graphProtocolInstance.address);
    await bitStakerRegisteryInstance.functions.enableLogic(oneInchProtocolInstance.address);
    await bitStakerRegisteryInstance.functions.enableLogic(connectV2AaveV2Instance.address);
    await bitStakerRegisteryInstance.functions.enableLogic(fundGatewayInstance.address);

    const response = await bitStakerRegisteryInstance.functions.logic(graphProtocolInstance.address);
    console.log(response);
    const contractAddress = {
        BitStakerRegistery: bitStakerRegisteryInstance.address,
        GraphProtocol: graphProtocolInstance.address,
        oneInchProtocol: oneInchProtocolInstance.address,
        AAVEProtocol: connectV2AaveV2Instance.address,
        fundGateway: fundGatewayInstance.address,
        userWalletAddress: userWalletAddress[0]
    };

     fs.writeFileSync(`${hre.network.name}_contract.json`, JSON.stringify(contractAddress));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

