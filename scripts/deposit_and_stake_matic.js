

const Web3 = require('web3');
const axios = require('axios');
const abiDecoder = require('abi-decoder');
const UserWallet = require('../artifacts/contracts/BitStakerRegistry.sol/UserWallet.json');
const ERC20 = require('../artifacts/contracts/IERC20Interface.sol/IERC20Interface.json');
const OneInch = require('../artifacts/contracts/protocols/1inch/1Inch.sol/OneInch.json');
const MaticProtocol = require('../artifacts/contracts/protocols/matic/MaticProtocol.sol/MaticProtocol.json');
//const ContractAddresses = require('../mainnetfork_contract.json');
const ContractAddresses = require('../localhost_contract.json');
const FundGateway = require('../artifacts/contracts/FundGateway.sol/FundGateway.json');

const perform = async () => {

    const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  // const web3 = new Web3('http://35.208.215.170:8080');
    const web3 = new Web3('http://localhost:8545');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    web3.eth.accounts.wallet.add(account);

    const balance = await web3.eth.getBalance(account.address);
    console.log(balance);
    const sourceToken = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    const amount = '10000000000000000000';
    const fromAddress = account.address;

    const sourceTokenERC20Instance = new web3.eth.Contract(ERC20.abi, sourceToken);

    const fundGatewayInstance = new web3.eth.Contract(FundGateway.abi, ContractAddresses.fundGateway);
    const userWalletInstance = new web3.eth.Contract(UserWallet.abi, ContractAddresses.userWalletAddress);
    const maticProtocolInstance = new web3.eth.Contract(MaticProtocol.abi, ContractAddresses.maticProtocol);
    const approvalTransaction  = sourceTokenERC20Instance.methods.approve(ContractAddresses.userWalletAddress, amount);

    const approvalReceipt = await approvalTransaction.send({
        from: fromAddress,
        gas: 300000
    })

    console.log(approvalReceipt);

    const fundGatewayEncodedData = fundGatewayInstance.methods.deposit(
        sourceToken, 
        amount,
        ).encodeABI();
    

    const maticProtocolEncodedData = maticProtocolInstance.methods.buyShare(
        121, 
        amount,
        0,
        0
    ).encodeABI();

    //Graph Protocol
    const transaction = userWalletInstance.methods.executeMulti(
        [ ContractAddresses.fundGateway, ContractAddresses.maticProtocol],
        [fundGatewayEncodedData, maticProtocolEncodedData],
        1,
        1
    );

    const gas = await transaction.estimateGas({
        from: fromAddress,
    });

   console.log('gas : ', gas);

    const executeReceipt = await transaction.send({
        from: fromAddress,
        gas: gas,
    }).on('transactionHash', (hash) => {
        console.log(" approval hash " + hash);
    });


    abiDecoder.addABI(MaticProtocol.abi);

    const receipt = await web3.eth.getTransactionReceipt(executeReceipt.transactionHash);
    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);

    console.log(JSON.stringify(decodedLogs));

}

perform().then(() => console.log('done'));