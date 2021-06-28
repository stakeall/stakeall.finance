pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "./IERC20Interface.sol";
import "./helpers/Basic.sol";

contract FundGateway is Basic {


function deposit(address _token, uint256 _amount) public {
    IERC20Interface(_token).transferFrom(msg.sender, address(this), _amount);
}

function withdraw(address _token, uint256 _amount, uint256 getId) payable public {

    uint256 amount = getUint(getId, _amount);
    bool isEth = _token == ethAddr;
    address payable beneficiary = msg.sender;
    console.log("beneficiary  ", beneficiary  );
    if(isEth) {
        beneficiary.transfer(amount);
    } else {
        IERC20Interface(_token).transfer(msg.sender, amount);
    }
    
}

}