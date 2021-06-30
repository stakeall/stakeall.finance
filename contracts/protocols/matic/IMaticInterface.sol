interface IStakeManagerProxy {
    
    function getValidatorContract(uint256 validatorId) external view returns (address);
}

interface IValidatorShareProxy {
    function buyVoucher(uint256 _amount, uint256 _minSharesToMint) external ;
} 