export const oneInchRegistryABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_source",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_sourceAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_destination",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_destinationAmount",
        "type": "uint256"
      }
    ],
    "name": "TokenSwapped",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_sourceToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_destinationToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_callData",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_swappedAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
];