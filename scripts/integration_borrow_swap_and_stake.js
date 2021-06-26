

const Web3 = require('web3');
const axios = require('axios');
const abiDecoder = require('abi-decoder');
const UserWallet = require('../artifacts/contracts/BitStakerRegistry.sol/UserWallet.json');
const ERC20 = require('../artifacts/contracts/IERC20Interface.sol/IERC20Interface.json');
const OneInch = require('../artifacts/contracts/protocols/1inch/1Inch.sol/OneInch.json');
const GraphProtocol = require('../artifacts/contracts/protocols/graph-protocol/GraphProtocol.sol/GraphProtocol.json');
const ContractAddresses = require('../localhost_contract.json');
const AaveProtocolArtifacts = require('../artifacts/contracts/protocols/aave/ConnectV2AaveV2.sol/AaveResolver.json');

const perform = async () => {

    const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const web3 = new Web3('http://localhost:8545');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    web3.eth.accounts.wallet.add(account);

    const aaveProtocolAddress = ContractAddresses.AAVEProtocol;

    const aaveInstance = new web3.eth.Contract(AaveProtocolArtifacts.abi, aaveProtocolAddress);

    const borrowTokenAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
    const sourceToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const amount = '1000000000000000000';
    const borrowAmount = '1000000000';
    const rateMode = '1';
    const slippage = 1;
    const destinationToken = '0xc944e90c64b2c07662a292be6244bdf05cda44a7';
    const fromAddress = account.address;
    const indexer = '0x85fe868adf7f5950b052469075556fb207e5372d';
    const getId = 1;
    const setId = 1;

    const borrowERC20Instance = new web3.eth.Contract(ERC20.abi, borrowTokenAddress);
    const destinationTokenERC20Instance = new web3.eth.Contract(ERC20.abi, destinationToken);

    const userWalletInstance = new web3.eth.Contract(UserWallet.abi, ContractAddresses.userWalletAddress);

    const aaveDepositAndBorrowEncodedData = aaveInstance.methods.depositAndBorrow(
        sourceToken,
        borrowTokenAddress,
        amount,
        borrowAmount,
        rateMode,
        0,
        setId
    ).encodeABI();

    console.log('aaveDepositAndBorrowEncodedData :', aaveDepositAndBorrowEncodedData);


    // One Inch 

    const request =
        `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${borrowTokenAddress}&toTokenAddress=${destinationToken}&amount=${borrowAmount}&slippage=${slippage}&fromAddress=${ContractAddresses.userWalletAddress}&disableEstimate=true`;
    console.log(request);
    const swapResponse = await axios.get(request);

    console.log('destination Amount from swap  ' + swapResponse.data.toTokenAmount);

    console.log('Contract address ' + swapResponse.data.tx.to);

    const oneInchProxy = new web3.eth.Contract(OneInch.abi, ContractAddresses.oneInchProtocol);

    const swapTransactionEncodedData = oneInchProxy.methods.swap(
        borrowAmount,
        borrowTokenAddress,
        destinationToken,
        swapResponse.data.tx.to,
        swapResponse.data.tx.data,
        0,
        getId,
        setId
        
    ).encodeABI();

    // One Inch finish


    //Graph Protocol

    const graphInstance = new web3.eth.Contract(GraphProtocol.abi, ContractAddresses.GraphProtocol);
    const graphProtocolEncodedData = graphInstance.methods.delegate(
        indexer,
        swapResponse.data.toTokenAmount,
        getId
    ).encodeABI();
    // Graph Protocol

    const transaction = userWalletInstance.methods.executeMulti(
        [aaveProtocolAddress, ContractAddresses.oneInchProtocol, ContractAddresses.GraphProtocol],
        [aaveDepositAndBorrowEncodedData, swapTransactionEncodedData, graphProtocolEncodedData],
        //     [ ContractAddresses.oneInchProtocol],
        //    [ swapTransactionEncodedData],
        1,
        1
    );
    // const gas = await transaction.estimateGas({
    //     from: fromAddress,
    //     value: amount
    // });

    // console.log('gas : ', gas);

    const executeReceipt = await transaction.send({
        from: fromAddress,
        gas: '10000000',
        value: amount
    }).on('transactionHash', (hash) => {
        console.log(" approval hash " + hash);
    });

    console.log(executeReceipt);

    abiDecoder.addABI(OneInch.abi);
    abiDecoder.addABI(AaveProtocolArtifacts.abi);
    abiDecoder.addABI(UserWallet.abi);
    abiDecoder.addABI(GraphProtocol.abi);

    const receipt = await web3.eth.getTransactionReceipt(executeReceipt.transactionHash);
    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);

    console.log(JSON.stringify(decodedLogs));

    console.log('borrow value of user wallet ', await borrowERC20Instance.methods.balanceOf(ContractAddresses.userWalletAddress).call());
    console.log('borrow value of user wallet ', await destinationTokenERC20Instance.methods.balanceOf(ContractAddresses.userWalletAddress).call());

}

perform().then(() => console.log('done'));