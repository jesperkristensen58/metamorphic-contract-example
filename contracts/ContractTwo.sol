pragma solidity ^0.5.6;

contract ContractTwo {
    function add(uint256 x) public view returns (uint256) {
        return x + 2; // now we add 2 to x.
    }

    function kill() public {
        selfdestruct(tx.origin);
    }
}