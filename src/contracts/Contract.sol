// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingToken is ERC20 {
    using EnumerableSet for EnumerableSet.AddressSet;
    using SafeMath for uint256;

    uint256 private constant REWARD_RATE = 100; // Reward rate in percentage (e.g., 100 for 100%)
    uint256 private constant SECONDS_IN_DAY = 86400; // Number of seconds in a day

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        uint256 lastClaimTime;
        uint256 totalReward;
    }

    mapping(address => Stake) private stakingInfo;
    EnumerableSet.AddressSet private stakers;

    constructor() ERC20("name", "symbol") {}

    function mint(address _a,uint256 amount) external {
        _mint(_a, amount);
    }

    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        if (stakingInfo[msg.sender].amount == 0) {
            stakers.add(msg.sender);
        }

        stakingInfo[msg.sender].amount = stakingInfo[msg.sender].amount.add(amount);
        stakingInfo[msg.sender].startTime = block.timestamp;
        stakingInfo[msg.sender].endTime = 0;
        stakingInfo[msg.sender].lastClaimTime = block.timestamp;

        _transfer(msg.sender, address(this), amount);
    }

    function unstake() external {
        require(stakingInfo[msg.sender].amount > 0, "No staked amount");

        uint256 amount = stakingInfo[msg.sender].amount;
        uint256 reward = calculateReward(msg.sender);

        stakingInfo[msg.sender].amount = 0;
        stakingInfo[msg.sender].startTime = 0;
        stakingInfo[msg.sender].endTime = 0;
        stakingInfo[msg.sender].lastClaimTime = 0;
        stakingInfo[msg.sender].totalReward = 0;

        stakers.remove(msg.sender);

        _transfer(address(this), msg.sender, amount.add(reward));
    }

    function calculateReward(address staker) public view returns (uint256) {
        uint256 reward = 0;

        if (stakingInfo[staker].amount > 0) {
            uint256 endTime = stakingInfo[staker].endTime > 0 ? stakingInfo[staker].endTime : block.timestamp;
            uint256 duration = endTime.sub(stakingInfo[staker].startTime);
            uint256 rewardPerSecond = stakingInfo[staker].amount.mul(REWARD_RATE).div(100).div(SECONDS_IN_DAY);

            reward = duration.mul(rewardPerSecond);
        }

        return reward;
    }

    function claimReward() external {
        require(stakingInfo[msg.sender].amount > 0, "No staked amount");

        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No available reward");

        uint256 currentTime = block.timestamp;
        stakingInfo[msg.sender].lastClaimTime = currentTime;
        stakingInfo[msg.sender].totalReward = stakingInfo[msg.sender].totalReward.add(reward);

        _transfer(address(this), msg.sender, reward);
    }
    function totalStakedAmount() external view returns (uint256) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < stakers.length(); i++) {
            address staker = stakers.at(i);
            totalAmount = totalAmount.add(stakingInfo[staker].amount);
        }

        return totalAmount;
    }

    function stakerInfo(address staker) external view returns (Stake memory) {
        return stakingInfo[staker];
    }

    function stakersCount() external view returns (uint256) {
        return stakers.length();
    }
}