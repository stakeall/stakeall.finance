pragma experimental ABIEncoderV2;
import "../../IERC20Interface.sol";
import "../../helpers/Basic.sol";

contract OneInch is Basic {
    event TokenSwapped(
        address _source,
        uint256 _sourceAmount,
        address _destination,
        uint256 _destinationAmount
    );

    function swap(
        uint256 _amount,
        address _sourceToken,
        address _destinationToken,
        address _to,
        bytes memory _callData,
        uint256 _value
    ) public payable returns (uint256 _swappedAmount) {
   
        _swappedAmount = _swap(
            _amount,
            _sourceToken,
            _destinationToken,
            _to,
            _callData,
            _value
        );

    }

    function _swap(
        uint256 _amount,
        address _sourceToken,
        address _destinationToken,
        address _to,
        bytes memory _callData,
        uint256 _value
    ) private returns (uint256 _swappedAmount) {

        bool isEth = _sourceToken == ethAddr;

        if(!isEth) {
            IERC20Interface(_sourceToken).approve(_to, _amount);
        }
        uint256 initialBalance =
            IERC20Interface(_destinationToken).balanceOf(address(this));
        // solium-disable-next-line security/no-call-value
        (bool success, ) = _to.call{value: _value}(_callData);
        if (!success) revert("1Inch-swap-failed");
        uint256 finalBalance =
            IERC20Interface(_destinationToken).balanceOf(address(this));

        if(!isEth) {
            IERC20Interface(_sourceToken).approve(_to, 0);    
        }    
        
        _swappedAmount = finalBalance - initialBalance;

        emit TokenSwapped(
            _sourceToken,
            _amount,
            _destinationToken,
            _swappedAmount
        );
    }
}
