# Bitstake

Steps to run : 
    1. Replace `MAINNET_INFURA_API` with infura mainnet endpoint in hardhat.config.js. Project forks mainnet using hardhat. Also, replace `PRIVATE_KEY`. 
    2. Start local hardhat forked node by running `npm run start-mainnet-fork`.
    3. Deploy contracts on forked node by running command as `npm run deploy-all-fork` and then running `npm run deploy_memory_on_fork`.
    4. Go to `app` folder and type command `yarn dev` to start the application at http://localhost:3000 .


Contracts : 
    1. GraphProtocol :  It facilitates users for delegation to indexers.
    2. MaticProtcol : It helps to stake to matic validators.
    3. 1inch : It allows to swap tokens using 1inch exchange.
    4. ConnectV2AaveV2 : It allows users to deposit and borrow assets from AAVE V2 protocol.
    5. BitStakeRegistry : It will create user wallet if not already created and manages modules to which user can interact.


AAVE V2 gas consumption :
    deposit gas : 0.00093258
    borrow gas : 0.00176655