// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title MultiSigWallet
 * @dev A multi-signature wallet contract that requires multiple approvals for transactions
 */
contract MultiSigWallet {
    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event RequirementChanged(uint256 required);
    event TransactionSubmitted(
        uint256 indexed transactionId,
        address indexed sender,
        address indexed destination,
        uint256 value,
        bytes data
    );
    event TransactionConfirmed(uint256 indexed transactionId, address indexed owner);
    event TransactionRevoked(uint256 indexed transactionId, address indexed owner);
    event TransactionExecuted(uint256 indexed transactionId, address indexed owner);

    // State Variables
    mapping(address => bool) public isOwner;
    address[] public owners;
    uint256 public requiredSignatures;
    
    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }
    
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    uint256 public transactionCount;

    // Modifiers
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier transactionExists(uint256 transactionId) {
        require(transactions[transactionId].destination != address(0), "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 transactionId) {
        require(!transactions[transactionId].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint256 transactionId) {
        require(!confirmations[transactionId][msg.sender], "Transaction already confirmed");
        _;
    }

    // Constructor
    constructor(address[] memory _owners, uint256 _requiredSignatures) {
        require(_owners.length > 0, "Owners required");
        require(_requiredSignatures > 0 && _requiredSignatures <= _owners.length, "Invalid required signatures");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }

        requiredSignatures = _requiredSignatures;
    }

    // Functions
    function submitTransaction(address _destination, uint256 _value, bytes memory _data) 
        public
        onlyOwner 
        returns (uint256 transactionId)
    {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: _destination,
            value: _value,
            data: _data,
            executed: false,
            confirmations: 0
        });
        transactionCount += 1;
        emit TransactionSubmitted(transactionId, msg.sender, _destination, _value, _data);
    }

    function confirmTransaction(uint256 _transactionId)
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
        notConfirmed(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];
        transaction.confirmations += 1;
        confirmations[_transactionId][msg.sender] = true;
        emit TransactionConfirmed(_transactionId, msg.sender);
        if (transaction.confirmations >= requiredSignatures) {
            executeTransaction(_transactionId);
        }
    }

    function revokeConfirmation(uint256 _transactionId)
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
    {
        require(confirmations[_transactionId][msg.sender], "Transaction not confirmed");
        Transaction storage transaction = transactions[_transactionId];
        transaction.confirmations -= 1;
        confirmations[_transactionId][msg.sender] = false;
        emit TransactionRevoked(_transactionId, msg.sender);
    }

    function executeTransaction(uint256 _transactionId)
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];
        require(transaction.confirmations >= requiredSignatures, "Not enough confirmations");
        
        transaction.executed = true;
        (bool success, ) = transaction.destination.call{value: transaction.value}(transaction.data);
        require(success, "Transaction execution failed");
        
        emit TransactionExecuted(_transactionId, msg.sender);
    }

    function addOwner(address _owner) 
        public 
        onlyOwner 
    {
        require(_owner != address(0), "Invalid owner");
        require(!isOwner[_owner], "Already owner");
        isOwner[_owner] = true;
        owners.push(_owner);
        emit OwnerAdded(_owner);
    }

    function removeOwner(address _owner)
        public
        onlyOwner
    {
        require(isOwner[_owner], "Not owner");
        require(owners.length - 1 >= requiredSignatures, "Too few owners left");
        isOwner[_owner] = false;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == _owner) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }
        emit OwnerRemoved(_owner);
    }

    function changeRequirement(uint256 _required)
        public
        onlyOwner
    {
        require(_required > 0 && _required <= owners.length, "Invalid required number of owners");
        requiredSignatures = _required;
        emit RequirementChanged(_required);
    }

    // View functions
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    function getTransaction(uint256 _transactionId) 
        public 
        view 
        returns (
            address destination,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_transactionId];
        return (
            transaction.destination,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.confirmations
        );
    }

    // Receive function to accept ETH
    receive() external payable {}
} 