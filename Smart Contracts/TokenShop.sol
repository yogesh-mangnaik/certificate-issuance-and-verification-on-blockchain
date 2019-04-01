pragma solidity >=0.4.22 <0.6.0;

/*This contract is defined for companies to be 
able to buy tokens by giving ethereum*/

import "./MyToken.sol";

contract TokenShop{
	address public admin;
	MyToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);

	constructor (MyToken _tokenContract, uint256 _tokenPrice) public{
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
    	require(msg.value == multiply(_numberOfTokens, tokenPrice));
    	require(tokenContract.balanceOf(this) >= _numberOfTokens);
    	require(tokenContract.transfer(msg.sender, _numberOfTokens));

    	tokensSold += _numberOfTokens;

    	emit Sell(msg.sender, _numberOfTokens);
    }
}