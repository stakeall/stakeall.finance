# stakeall.finance
stakeall.finance aims to provide a single platform for easily managing delegation to these POS protocols by leveraging integrations of various DeFi protocols. Users can use this platform to borrow from lending protocols like AAVE and Compound, swap tokens from decentralised exchanges like 1inch and Uniswap, and stake to POS protocols in single transactions for earning passive income. With these features available in one click, it saves significant gas cost and time for users. Below are the use-cases supported :

1. Wallet Creation: Platform allows user to create on chain wallet to manage their funds.
2. Staking using wallet: With this feature, users can use funds available in various wallets to delegate to POS protocols.
3. Swap and Stake : This allows user to swap funds with best rates to the currency required by POS protocol and stake it. It save significant gas cost and time as this is done in single transaction.
4. Borrow and Stake: This feature allows user to use funds as collateral to borrow for lending protocols, swap them at best exchange rate in desired currency and stake it to POS protocols. Platform enables user to compare interest rates and swap amount across various assets

Again, this saves significant gas cost and time as this is done in single transaction.

For this hackathon, we have integrated with below mentioned protocols in the project:

1. AAVE V2: We used AAVE V2 protocol for depositing users funds as a collateral to borrow assets for staking.
2. 1Inch Exchange: We used 1inch exchange contracts to swap assets in desired staking currency.
3. Graph Protocol: Our smart contracts are integrated with The Graph Protocol smart contracts to enable delegation to indexers.
4. Matic Network: Our smart contracts are integrated with Polygon(Matic) Network smart contracts to enable delegation to validators.
5. Covalent API: We used covalent API to fetch latest cryptocurrency prices and balances of an account.

Apart from the above integration our smart contracts are written in solidity language, we are using hardhat for forking mainnet for testing purpose and Front end is written in Next.js.



### Steps to run : 
    1. Replace `MAINNET_INFURA_API` with infura mainnet endpoint in hardhat.config.js. Project forks mainnet using hardhat. Also, replace `PRIVATE_KEY`. 
    2. Start local hardhat forked node by running `npm run start-mainnet-fork`.
    3. Deploy contracts on forked node by running command as `npm run deploy-all-fork` and then running `npm run deploy_memory_on_fork`.
    4. Go to `app` folder and type command `yarn dev` to start the application at http://localhost:3000 .



#### Contracts : 
    1. GraphProtocol :  It facilitates users for delegation to indexers.
    2. MaticProtcol : It helps to stake to matic validators.
    3. 1inch : It allows to swap tokens using 1inch exchange.
    4. ConnectV2AaveV2 : It allows users to deposit and borrow assets from AAVE V2 protocol.
    5. BitStakeRegistry : It will create user wallet if not already created and manages modules to which user can interact.
