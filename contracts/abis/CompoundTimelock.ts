export const compoundTimelockAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "admin_", "type": "address" },
      { "internalType": "uint256", "name": "delay_", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "newAdmin", "type": "address" }
    ],
    "name": "NewAdmin",
    "type": "event"
  }
] as const;