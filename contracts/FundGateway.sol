pragma experimental ABIEncoderV2;

import "./IERC20Interface.sol";
import "./helpers/Basic.sol";

contract FundGateway is Basic {


function deposit(address _token, uint256 _amount) public {
    IERC20Interface(_token).transferFrom(msg.sender, address(this), _amount);
}

function withdraw(address _token, uint256 _amount) public {

    bool isEth = _token == ethAddr;
    address payable beneficiary = msg.sender;
    if(isEth) {
        beneficiary.transfer(_amount);
    } else {
        IERC20Interface(_token).transfer(msg.sender, _amount);
    }
    
}

}