pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import './IMaticInterface.sol';
import '../../IERC20Interface.sol';
import "../../helpers/Basic.sol";


contract MaticProtocol is Basic {

    event MaticValidatorDelegated(
        uint256 validatorId,
        address validatorAddress,
        uint256 amount
    );

    // https://goerli.etherscan.io/address/0x00200ea4ee292e253e6ca07dba5edc07c8aa37a3#readProxyContract
    // https://docs.matic.network/docs/develop/network-details/genesis-contracts/

IStakeManagerProxy public constant stakeManagerProxy =
        IStakeManagerProxy(0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908);

        IERC20Interface public constant maticToken =
        IERC20Interface(0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0);


    function buyShare(
        uint256 _validatorId, 
        uint256 _amount,
        uint256 _minShare,
         uint256 getId
    )
    payable
    public
    {

        uint256 amount = getUint(getId, _amount);
        IValidatorShareProxy validatorContractAddress =
         IValidatorShareProxy(stakeManagerProxy.getValidatorContract(_validatorId));

        require(address(validatorContractAddress) != address(0), "validator must exists");

        console.log("validatorContractAddress  ", address(validatorContractAddress));
        maticToken.approve( address(stakeManagerProxy), amount);
        validatorContractAddress.buyVoucher(_amount, _minShare);

        emit MaticValidatorDelegated(_validatorId, address(validatorContractAddress), _amount);
    }
}