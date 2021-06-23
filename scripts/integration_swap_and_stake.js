const Web3 = require('web3');
const axios = require('axios');
const abiDecoder = require('abi-decoder'); 
const OneInch = require('../../artifacts/contracts/protocols/1inch/1Inch.sol/OneInch.json');
const GraphProtocol = require("../../artifacts/contracts/protocols/graph-protocol/GraphProtocol.sol/GraphProtocol.json");
const UserWallet = require("../../artifacts/contracts/BitStakerRegistry.sol/UserWallet.json");

const ERC20 = require('../../artifacts/contracts/IERC20Interface.sol/IERC20Interface.json');
const LocalContract = require('../../localhost_contract.json')

const perform = async () => {

    const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const web3 = new Web3('http://localhost:8545');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    console.log(account);
    web3.eth.accounts.wallet.add(account);

    const block = await web3.eth.getBlock('latest');
    console.log(block.number);

    const sourceToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const destinationToken = '0xc944e90c64b2c07662a292be6244bdf05cda44a7';
    const amount = '10000000';
    const slippage = 1;
    const fromAddress = account.address;;

    
    const userWalletInstance = new web3.eth.Contract(UserWallet.abi, LocalContract.userWalletAddress);

    request = `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${sourceToken}&toTokenAddress=${destinationToken}&amount=${amount}&slippage=${slippage}&fromAddress=${fromAddress}&disableEstimate=true`;
    console.log(request);
    const swapResponse = await axios.get(request);
    
    const decodedData = abiDecoder.decodeMethod(swapResponse.data.tx.data);

    const oneInchProxy = new web3.eth.Contract(OneInch.abi, LocalContract.oneInchProtocol);

    const code = await web3.eth.getCode(LocalContract.oneInchProtocol);
    console.log(code);

    console.log(swapResponse.data.tx);
    const swapTransaction = oneInchProxy.methods.swap(
        amount,
        sourceToken,
        destinationToken,
        swapResponse.data.tx.to,
        swapResponse.data.tx.data,
        amount
    );

    const swapTransactionEncodeABISwap = swapTransaction.encodeABI();

    
    
}

perform().then(() => console.log('done'));