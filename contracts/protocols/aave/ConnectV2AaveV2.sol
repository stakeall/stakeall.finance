pragma experimental ABIEncoderV2;

import "../../IERC20Interface.sol";
import "./AAVEInterface.sol";
import "../../helpers/DSMath.sol";
import "../../helpers/Basic.sol";
import "./AAVEInterface.sol";

abstract contract Helpers is DSMath, Basic {
    
    /**
     * @dev Aave Lending Pool Provider
    */
    AaveLendingPoolProviderInterface constant internal aaveProvider = AaveLendingPoolProviderInterface(0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5);
    
    // Kovan testnet
    // AaveLendingPoolProviderInterface constant internal aaveProvider = AaveLendingPoolProviderInterface(0x88757f2f99175387aB4C6a4b3067c77A695b0349);

    /**
     * @dev Aave Protocol Data Provider
    */
    AaveDataProviderInterface constant internal aaveData = AaveDataProviderInterface(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d);
    
    // Kovan testnet
    // AaveDataProviderInterface constant internal aaveData = AaveDataProviderInterface(0x3c73A5E5785cAC854D468F727c606C07488a29D6);

    /**
     * @dev Aave Referral Code
    */
    uint16 constant internal referralCode = 3228;

    /**
     * @dev Checks if collateral is enabled for an asset
     * @param token token address of the asset.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
    */
    function getIsColl(address token) internal view returns (bool isCol) {
        (, , , , , , , , isCol) = aaveData.getUserReserveData(token, address(this));
    }

    /**
     * @dev Get total debt balance & fee for an asset
     * @param token token address of the debt.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
     * @param rateMode Borrow rate mode (Stable = 1, Variable = 2)
    */
    function getPaybackBalance(address token, uint rateMode) internal view returns (uint) {
        (, uint stableDebt, uint variableDebt, , , , , , ) = aaveData.getUserReserveData(token, address(this));
        return rateMode == 1 ? stableDebt : variableDebt;
    }

    /**
     * @dev Get total collateral balance for an asset
     * @param token token address of the collateral.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
    */
    function getCollateralBalance(address token) internal view returns (uint bal) {
        (bal, , , , , , , ,) = aaveData.getUserReserveData(token, address(this));
    }
}

contract Events {
    event LogDeposit(address indexed token, uint256 tokenAmt, uint256 getId, uint256 setId);
    event LogWithdraw(address indexed token, uint256 tokenAmt, uint256 getId, uint256 setId);
    event LogBorrow(address indexed token, uint256 tokenAmt, uint256 indexed rateMode, uint256 getId, uint256 setId);
    event LogPayback(address indexed token, uint256 tokenAmt, uint256 indexed rateMode, uint256 getId, uint256 setId);
    event LogEnableCollateral(address[] tokens);
    event LogSwapRateMode(address indexed token, uint256 rateMode);
}


abstract contract AaveResolver is Events, Helpers {
    /**
     * @dev Deposit ETH/ERC20_Token.
     * @notice Deposit a token to Aave v2 for lending / collaterization.
     * @param token The address of the token to deposit.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
     * @param amt The amount of the token to deposit. (For max: `uint256(-1)`)
    */
    function deposit(
        address token,
        uint256 amt
    ) public payable returns (uint256 amount_, address token_) {

        AaveProtocolInterface aave = AaveProtocolInterface(aaveProvider.getLendingPool());

        bool isEth = token == ethAddr;
        address _token = isEth ? wethAddr : token;

        IERC20Interface tokenContract = IERC20Interface(_token);

        if (isEth) {
            amt = amt == uint(-1) ? address(this).balance : amt;
            convertEthToWeth(isEth, AAVEInterface(address(tokenContract)), amt);
        } else {
            amt = amt == uint(-1) ? tokenContract.balanceOf(address(this)) : amt;
        }

        tokenContract.approve(address(aave), amt);

        aave.deposit(_token, amt, address(this), referralCode);

        amount_ = amt;
        token_ = _token;

        // if (!getIsColl(_token)) {
        //     aave.setUserUseReserveAsCollateral(_token, true);
        // }

        // setUint(setId, _amt);

        // _eventName = "LogDeposit(address,uint256,uint256,uint256)";
        // _eventParam = abi.encode(token, _amt, getId, setId);
    }

    /**
     * @dev Borrow ETH/ERC20_Token.
     * @notice Borrow a token using Aave v2
     * @param token The address of the token to borrow.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
     * @param amt The amount of the token to borrow.
     * @param rateMode The type of borrow debt. (For Stable: 1, Variable: 2)
    */
    function borrow(
        address token,
        uint256 amt,
        uint256 rateMode
    ) public payable {
        // uint _amt = getUint(getId, amt);

        AaveProtocolInterface aave = AaveProtocolInterface(aaveProvider.getLendingPool());

        bool isEth = token == ethAddr;
        address _token = isEth ? wethAddr : token;

        aave.borrow(_token, amt, rateMode, referralCode, address(this));
        convertWethToEth(isEth, IERC20Interface(_token), amt);

        // setUint(setId, _amt);

        // _eventName = "LogBorrow(address,uint256,uint256,uint256,uint256)";
        // _eventParam = abi.encode(token, _amt, rateMode, getId, setId);
    }

    function depositAndBorrow(
        address depositToken,
        address borrowToken,
        uint256 depositAmt,
        uint256 borrowAmt,
        uint256 rateMode
    ) 
        external payable
    {
        deposit(depositToken, depositAmt);
        borrow(borrowToken, borrowAmt, rateMode);
    }

    /**
     * @dev Enable collateral
     * @notice Enable an array of tokens as collateral
     * @param tokens Array of tokens to enable collateral
    */
    function enableCollateral(
        address[] calldata tokens
    ) external payable returns (string memory _eventName, bytes memory _eventParam) {
        uint _length = tokens.length;
        require(_length > 0, "0-tokens-not-allowed");

        AaveProtocolInterface aave = AaveProtocolInterface(aaveProvider.getLendingPool());

        for (uint i = 0; i < _length; i++) {
            address token = tokens[i];
            if (getCollateralBalance(token) > 0 && !getIsColl(token)) {
                aave.setUserUseReserveAsCollateral(token, true);
            }
        }

        _eventName = "LogEnableCollateral(address[])";
        _eventParam = abi.encode(tokens);
    }
}

contract ConnectV2AaveV2 is AaveResolver {
    string constant public name = "AaveV2-v1";
}
