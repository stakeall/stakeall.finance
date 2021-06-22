
// import ERC20Wrapper from './app/services/blockchain/ERC20Wrapper';
// import MaticValidator from './app/services/blockchain/MaticValidator';



// new MaticValidator(
//     'https://mainnet.infura.io/v3/c559cfe7f7754750aecc0d42a2cbf05b',
//     '0xc7757805b983ee1b6272c1840c18e66837de858e'
//     ).getStakeAmount("0x407c576366db6d5a9c56b485f156500ca6ebb0fb").then(console.log);


const Web3 = require('web3');
const UserWallet = require('../../build/contracts/UserWallet.json');
const GraphProtocol = require('../../build/contracts/IGraphProtocolInterface.json');
const ERC20 =  require('../../build/contracts/IERC20Interface.json');

// BitStaker Registry https://rinkeby.etherscan.io/address/0x809f8175A3FA45FBa7273E18e96aecD8962be75B#writeContract
const perform = async () => {

    const web3 = new Web3('https://rinkeby.infura.io/v3/token');

    const account = web3.eth.accounts.privateKeyToAccount("")
    console.log(account);
    web3.eth.accounts.wallet.add(account);

    const owner = "0x36Aa1ac5304bD493116b285eEa5f91f043E4A3e4"
    const wallet = "0x33121d2246bbca5b04bb09f565d90ee9d68ecb78";
    const amount = "100000000000000000000";
    const graphToken = "0x54Fe55d5d255b8460fB3Bc52D5D676F9AE5697CD";
    const graphProtocolLogic = "0xd8e275e1b5A31Fed1Ac75370E4F834f1ce85fCA1";
    const indexer = "0xd1dc8604ad129916a1037b6e43e85f0b8af2237d";

    const graphInstance = new web3.eth.Contract(GraphProtocol.abi, graphProtocolLogic);
    const data = graphInstance.methods.delegate(
        indexer,
        amount
    ).encodeABI();

    const undelegateData = graphInstance.methods.undelegate(
        indexer,
        "99500000000000000000"
    ).encodeABI();

    console.log(data);
    const instance = new web3.eth.Contract(UserWallet.abi, wallet);
    const grtERC20Instance = new web3.eth.Contract(ERC20.abi, graphToken);

    const approvaTransaction = grtERC20Instance.methods
        .approve(wallet, amount);

    const approvalReceipt = await approvaTransaction
        .send({
            from: owner,
            gas: '300000',
        }).on('transactionHash', (hash) => {
            console.log(" approval hash " + hash);
        });

    console.log(approvalReceipt);


    // const erc20Transaction = await instance.methods.execute(
    //     "0x54Fe55d5d255b8460fB3Bc52D5D676F9AE5697CD",// GRT address
    //     erc20Data,
    //     1,
    //     1
    // );

    // const gas  = await erc20Transaction.estimateGas({
    //     from: "0x36Aa1ac5304bD493116b285eEa5f91f043E4A3e4"
    // });

    // console.log(gas);

    // await erc20Transaction.send({
    //     from: "0x36Aa1ac5304bD493116b285eEa5f91f043E4A3e4",
    //     gas: '300000',
    // })
    // .on('transactionHash', (hash: string) =>{
    //     console.log("GRT hash "+hash);
    // })

    // Orignal Graph Protocol 0x8e1Be1E5E42095FFF96D3854dD14CB126B900E42
    // Graph protocol with Dummy Proxy 0x05325312b84871116c10e28efdA9c0EAA4cB2d5b
    // Graph protocol with Log msg.sender + this 0xa63cBF732A18087Ea8061ADb43e05739C76a9EBE
    // Graph protcol without transfer From and dmmy proxy 0x621c542E99F3cA9afFB9Fe0115A1dFC0E760358E
    // Without Approval and dummy proxy 0x6F99316702d350488f915f617509Dd2d40d98756
    // With hard coded address 0x2988f27C4b78Ff4d4039c3a718E8d13716F80db4
    const transaction = await instance.methods.executeMulti(
        [graphProtocolLogic],
        [data],
        1,
        1
    );

    const block = await web3.eth.getBlockNumber();
    console.log('block' + block);

    const gas = await transaction.estimateGas({
        from: owner
    });

    console.log(gas);
    const returnValue = await transaction.send({
        from: owner,
        gas: '300000',
    })
        .on('transactionHash', (hash) => {
            console.log("hash " + hash);
        })

    console.log(returnValue);


}

perform().then(() => console.log('done'));