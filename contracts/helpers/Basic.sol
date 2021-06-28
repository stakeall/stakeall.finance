pragma experimental ABIEncoderV2;

import "./DSMath.sol";
import "../IERC20Interface.sol";
import "../protocols/aave/AAVEInterface.sol";

interface BitStakeMemoryInterface {
    function getUint(uint id) external returns (uint num);
    function setUint(uint id, uint val) external;
}

abstract contract Stores {

  /**
   * @dev Return ethereum address
   */
  address constant internal ethAddr = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

  /**
   * @dev Return Wrapped ETH address
   */
  address constant internal wethAddr = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // Testnet
//   address constant internal wethAddr = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

  BitStakeMemoryInterface constant internal bitStakeMemory = BitStakeMemoryInterface(0xCD8a1C3ba11CF5ECfa6267617243239504a98d90);

  function getUint(uint getId, uint val) internal returns (uint returnVal) {
    returnVal = getId == 0 ? val : bitStakeMemory.getUint(getId);
  }

  /**
  * @dev Set Uint value in InstaMemory Contract.
  */
  function setUint(uint setId, uint val) virtual internal {
    if (setId != 0) bitStakeMemory.setUint(setId, val);
  }
}


abstract contract Basic is DSMath, Stores {

    function convert18ToDec(uint _dec, uint256 _amt) internal pure returns (uint256 amt) {
        amt = (_amt / 10 ** (18 - _dec));
    }

    function convertTo18(uint _dec, uint256 _amt) internal pure returns (uint256 amt) {
        amt = mul(_amt, 10 ** (18 - _dec));
    }

    function getTokenBal(IERC20Interface token) internal view returns(uint _amt) {
        _amt = address(token) == ethAddr ? address(this).balance : token.balanceOf(address(this));
    }

    function getTokensDec(IERC20Interface buyAddr, IERC20Interface sellAddr) internal view returns(uint buyDec, uint sellDec) {
        buyDec = address(buyAddr) == ethAddr ?  18 : buyAddr.decimals();
        sellDec = address(sellAddr) == ethAddr ?  18 : sellAddr.decimals();
    }

    function encodeEvent(string memory eventName, bytes memory eventParam) internal pure returns (bytes memory) {
        return abi.encode(eventName, eventParam);
    }

    function changeEthAddress(address buy, address sell) internal pure returns(IERC20Interface _buy, IERC20Interface _sell){
        _buy = buy == ethAddr ? IERC20Interface(wethAddr) : IERC20Interface(buy);
        _sell = sell == ethAddr ? IERC20Interface(wethAddr) : IERC20Interface(sell);
    }

    function convertEthToWeth(bool isEth, AAVEInterface token, uint amount) internal {
        if(isEth) token.deposit{value: amount}();
    }

    function convertWethToEth(bool isEth, IERC20Interface token, uint amount) internal {
       if(isEth) {
            token.approve(address(token), amount);
            AAVEInterface(address(token)).withdraw(amount);
        }
    }
}