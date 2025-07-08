export const openzeppelinTimelockAbi = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "minDelay", "type": "uint256" },
      { "internalType": "address[]", "name": "proposers", "type": "address[]" },
      { "internalType": "address[]", "name": "executors", "type": "address[]" },
      { "internalType": "address", "name": "admin", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" },
      { "indexed": true, "internalType": "uint256", "name": "index", "type": "uint256" },
      { "internalType": "address", "name": "target", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "CallScheduled",
    "type": "event"
  }
] as const;