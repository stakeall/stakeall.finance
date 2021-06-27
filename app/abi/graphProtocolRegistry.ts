export const graphProtocolAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_indexer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_share",
        "type": "uint256"
      }
    ],
    "name": "GraphProtocolDelegated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_indexer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_share",
        "type": "uint256"
      }
    ],
    "name": "GraphProtocolUnDelegated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_indexer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_delegateToIndexer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokens",
        "type": "uint256"
      }
    ],
    "name": "GraphProtocolWithdrawDelegated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_graphProxy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_grtTokenAddress",
        "type": "address"
      }
    ],
    "name": "LogDelegate",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_indexer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "getId",
        "type": "uint256"
      }
    ],
    "name": "delegate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares_",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "graphProxy",
    "outputs": [
      {
        "internalType": "contract IGraphProtocolInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "grtTokenAddress",
    "outputs": [
      {
        "internalType": "contract IERC20Interface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_indexer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_shares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "getId",
        "type": "uint256"
      }
    ],
    "name": "undelegate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokens_",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_indexer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_delegateToIndexer",
        "type": "address"
      }
    ],
    "name": "withdrawDelegated",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokens_",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]