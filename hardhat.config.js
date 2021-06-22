require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const INFURA_API = 'https://rinkeby.infura.io/v3/0b3c6bddd7d14140a0640806a04c2d49'; // network api key from infura
const PRIVATE_KEY = 'bf6a5360ab60d382c2eba4fd79b176cdd8d661a7e8bf5d35aa39d4aae614d088'; // prepend with private key without 0x
const defaultNetwork = "localhost";


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  console.log('accounts ', accounts);
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ""
  },
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545", // uses account 0 of the hardhat node to deploy
    },
    mainnet: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    rinkeby: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    kovan: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ropsten: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 100000000000
    },
    kovan: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
      // gasPrice: 100000000000
    },
    polygon: {
      url: INFURA_API,
      accounts: [`0x${PRIVATE_KEY}`],
      // gasPrice: 100000000000
    },
    hardhat: {
      forking: {
        url: INFURA_API,
        blockNumber: 4824140// after transfer tx : https://goerli.etherscan.io/tx/0x2ba0b8b77ca953af64978160046c161c2ba23b4a4c2c367edac10b94d259bb09
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
