import React, { useState, useEffect, useRef,  } from "react";
import Withdraw from "../../components/voting-creators/withdraw";
import WithdrawERC20 from "../../components/voting-creators/withdrawERC20";
import Fee from "../../components/voting-creators/fee";
import ValidatorStakeAmount from "../../components/voting-creators/validatorStakeAmount";
import ValidatorStakeTimeout from "../../components/voting-creators/validatorStakeTimeout";
import PercentageOfVotesToConfirm from "../../components/voting-creators/percentageOfVotesToConfirm";
import VotingTimeout from "../../components/voting-creators/votingTimeout";
import CustomText from "../../components/voting-creators/customText";
import CertifiedConnector from "../../components/voting-creators/certifiedConnector";
import UnblockNode from "../../components/voting-creators/unblockNode";
import ValidatorBlockRewards from "../../components/voting-creators/validatorBlockRewards";


const CreateVoting = () => {
    const [votingOption, setVotingOption] = useState("0");
    
    const handleOnChange = (e: any) => {
        setVotingOption(e.target.value);
    }

    return (
        <>
            <div className="m-3 ">
                <div className="form-group label-floating">
                    <label className="control-label">Type of voting</label>
                    <select value={votingOption} onChange={handleOnChange} className="form-control" aria-label="Floating label select example">
                        <option value={"0"}>Open this voting type selection menu</option>
                        <option value={"1"}>Withdraw</option>
                        <option value={"2"}>Withdraw ERC20</option>
                        <option value={"3"}>Fee</option>
                        <option value={"4"}>Validator Stake Amount</option>
                        <option value={"5"}>Validator Stake Timeout</option>
                        <option value={"6"}>Percentage Of Votes To Confirm</option>
                        <option value={"7"}>Voting Timeout</option>
                        <option value={"8"}>Custom Text</option>
                        <option value={"9"}>Certified Connector</option>
                        <option value={"10"}>Unblock Node</option>
                        <option value={"11"}>Validator Block Rewards</option>
                    </select>
                </div>
            </div>

            <div className="m-3">
                {votingOption === "1" && <Withdraw/>}
                {votingOption === "2" && <WithdrawERC20/>}
                {votingOption === "3" && <Fee/>}
                {votingOption === "4" && <ValidatorStakeAmount/>}
                {votingOption === "5" && <ValidatorStakeTimeout/>}
                {votingOption === "6" && <PercentageOfVotesToConfirm/>}
                {votingOption === "7" && <VotingTimeout/>}
                {votingOption === "8" && <CustomText/>}
                {votingOption === "9" && <CertifiedConnector/>}
                {votingOption === "10" && <UnblockNode/>}
                {votingOption === "11" && <ValidatorBlockRewards/>}
            </div>
        </>
    )
}

export default CreateVoting;