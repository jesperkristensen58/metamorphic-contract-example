/**
 * @notice This is just a simple contract that has a different code hash than `ContractOne`. We ensure the difference by addinfg 2 to x instead of 1.
 * Note that `ContractOne` and `ContractTwo` need not be similar at all - just have different code hashes.
 * Also, we technically don't need `kill()` to solve the challenge (but we do for `ContractOne`!), but leave it here.
 * @author Jesper Kristensen
 */
pragma solidity ^0.5.6;

contract ContractTwo {
    function add(uint256 x) public view returns (uint256) {
        return x + 2; // now we add 2 to x.
    }

    function kill() public {
        selfdestruct(tx.origin);
    }
}