pragma solidity ^0.5.6;

contract ContractOne {
    function add(uint256 x) public view returns (uint256) {
        return x + 1; // contract one adds just "1" to x; then see ContractTwo.sol
    }

    function kill() public {
        selfdestruct(tx.origin);
    }
}