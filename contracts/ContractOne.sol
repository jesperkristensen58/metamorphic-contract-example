/**
 * @notice This is just an example contract used to solve the challenge. Can be anything really, but we keep it simple.
 * Note that `ContractTwo` is then a contract with another code hash - we just picked something that looks very similar to this code below, but technically it needs not be.
 * @author: Jesper Kristensen
 */
pragma solidity ^0.5.6;

contract ContractOne {
    function add(uint256 x) public view returns (uint256) {
        return x + 1; // contract one adds just "1" to x; then see ContractTwo.sol
    }

    function kill() public {
        selfdestruct(tx.origin);
    }
}