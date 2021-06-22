pragma solidity ^0.7.0; 

interface AAVEInterface {
    function deposit() external payable;
    function withdraw(uint) external;
}
