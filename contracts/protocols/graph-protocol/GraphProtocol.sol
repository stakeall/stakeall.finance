pragma experimental ABIEncoderV2;

import "../../IERC20Interface.sol";
import "../../helpers/Basic.sol";

interface IGraphProtocolInterface {

    function delegate(address _indexer, uint256 _tokens)
        payable
        external
        returns (uint256 shares_);

    function undelegate(address _indexer, uint256 _shares)
        external
        returns (uint256 tokens_);

    function withdrawDelegated(address _indexer, address _delegateToIndexer)
        external
        returns (uint256 tokens_);
}

contract GraphProtocol is  Basic {

    event GraphProtocolDelegated(
        address _indexer,
        uint256 _amount,
        uint256 _share
    );
    event GraphProtocolUnDelegated(
        address _indexer,
        uint256 _amount,
        uint256 _share
    );
    event GraphProtocolWithdrawDelegated(
        address _indexer,
        address _delegateToIndexer,
        uint256 _tokens
    );

    IGraphProtocolInterface public constant graphProxy =
        IGraphProtocolInterface(0xF55041E37E12cD407ad00CE2910B8269B01263b9);
    IERC20Interface public constant grtTokenAddress =
        IERC20Interface(0xc944E90C64B2c07662A292be6244BDf05Cda44a7);

    event LogDelegate(address _graphProxy, address _grtTokenAddress);

    function delegate(address _indexer, uint256 _tokens, uint256 getId)
        public
        payable
        returns (uint256 shares_)
    {
        uint256 tokens = getUint(getId, _tokens);
        shares_ = _delegate(_indexer, tokens);
    }

    function _delegate(address _indexer, uint256 _tokens)
        private
        returns (uint256 shares_)
    {
        grtTokenAddress.approve(address(graphProxy), _tokens);
        shares_ = graphProxy.delegate(_indexer, _tokens);
        grtTokenAddress.approve(address(graphProxy), 0);
        emit GraphProtocolDelegated(_indexer, _tokens, shares_);
    }

    function undelegate(address _indexer, uint256 _shares, uint getId)
        public
        returns (uint256 tokens_)
    {
        uint256 shares = getUint(getId, _shares);
        tokens_ = graphProxy.undelegate(_indexer, shares);
        emit GraphProtocolDelegated(_indexer, tokens_, _shares);
    }

    
    function withdrawDelegated(address _indexer, address _delegateToIndexer)
        public
        returns (uint256 tokens_)
    {
        tokens_ = graphProxy.withdrawDelegated(_indexer, _delegateToIndexer);
        emit GraphProtocolWithdrawDelegated(
            _indexer,
            _delegateToIndexer,
            tokens_
        );
    }
}
