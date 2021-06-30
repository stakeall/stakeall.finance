

const Web3 = require('web3');
const axios = require('axios');
const abiDecoder = require('abi-decoder');
const UserWallet = require('../artifacts/contracts/BitStakerRegistry.sol/UserWallet.json');
const ERC20 = require('../artifacts/contracts/IERC20Interface.sol/IERC20Interface.json');
const OneInch = require('../artifacts/contracts/protocols/1inch/1Inch.sol/OneInch.json');
const GraphProtocol = require('../artifacts/contracts/protocols/graph-protocol/GraphProtocol.sol/GraphProtocol.json');
//const ContractAddresses = require('../mainnetfork_contract.json');
const ContractAddresses = require('../localhost_contract.json');
const FundGateway = require('../artifacts/contracts/FundGateway.sol/FundGateway.json');

const perform = async () => {

    const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    //const web3 = new Web3('http://35.208.215.170:8080');
    const web3 = new Web3('http://localhost:8545');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    web3.eth.accounts.wallet.add(account);

    const balance = await web3.eth.getBalance(account.address);
    console.log(balance);
    const sourceToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const amount = '100000000000000000';
    const slippage = 1;
    const destinationToken = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    const fromAddress = account.address;
    const getId = 1;
    const setId = 1;

    const destinationTokenERC20Instance = new web3.eth.Contract(ERC20.abi, destinationToken);

    const fundGatewayInstance = new web3.eth.Contract(FundGateway.abi, ContractAddresses.fundGateway);
    const userWalletInstance = new web3.eth.Contract(UserWallet.abi, ContractAddresses.userWalletAddress);

    //console.log(userWalletInstance);
    userWalletInstance.events.LogExecute({fromBlock: 0 },(e, res) => console.log('res'+res))

    // One Inch 

    const request =
        `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${amount}&slippage=${slippage}&fromAddress=${ContractAddresses.userWalletAddress}&disableEstimate=true`;
    console.log(request);
    const swapResponse = await axios.get(request);

    console.log('destination Amount from swap  ' + swapResponse.data.toTokenAmount);

    console.log('Contract address ' + swapResponse.data.tx.to);

    const oneInchProxy = new web3.eth.Contract(OneInch.abi, ContractAddresses.oneInchProtocol);

    const swapTransactionEncodedData = oneInchProxy.methods.swap(
        amount,
        sourceToken,
        destinationToken,
        swapResponse.data.tx.to,
        swapResponse.data.tx.data,
        amount,
        0,
        setId
    ).encodeABI();


    const fundGatewayEncodedData = fundGatewayInstance.methods.withdraw(
        destinationToken, 
        100,
        getId
        ).encodeABI();
    // One Inch finish

    //Graph Protocol
    const transaction = userWalletInstance.methods.executeMulti(
        [ContractAddresses.oneInchProtocol, ContractAddresses.fundGateway],
        [swapTransactionEncodedData, fundGatewayEncodedData],
        1,
        1
    );
    const gas = await transaction.estimateGas({
        from: fromAddress,
        value: amount
    });

   console.log('gas : ', gas);

    const executeReceipt = await transaction.send({
        from: fromAddress,
        gas: 10000000,
        value: amount
    }).on('transactionHash', (hash) => {
        console.log(" approval hash " + hash);
    });


    abiDecoder.addABI(OneInch.abi);
    abiDecoder.addABI(UserWallet.abi);

    const receipt = await web3.eth.getTransactionReceipt(executeReceipt.transactionHash);
    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);

    console.log(JSON.stringify(decodedLogs));

    console.log('borrow value of user wallet ', await destinationTokenERC20Instance.methods.balanceOf(ContractAddresses.userWalletAddress).call());
    console.log('borrow value of user wallet ', await destinationTokenERC20Instance.methods.balanceOf(fromAddress).call());

}

perform().then(() => console.log('done'));