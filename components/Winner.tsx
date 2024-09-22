'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react"
import { contract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";

export const Winner = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data: currentRound } = useReadContract({
        contract: contract,
        method: "currentRound",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: admin } = useReadContract({
        contract: contract,
        method: "admin",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: winnerforRound } = useReadContract({
        contract: contract,
        method: "winnerforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: highestBidforRound } = useReadContract({
        contract: contract,
        method: "winningBidforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: dividendAmountforRound } = useReadContract({
        contract: contract,
        method: "discountOfferedforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: defaultersForRound } = useReadContract({
        contract: contract,
        method: "defaulterCountforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: winningPotforRound } = useReadContract({
        contract: contract,
        method: "prizeMoneyforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: potWithdrawnforRound } = useReadContract({
        contract: contract,
        method: "cashoutStatusforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: userName } = useReadContract({
        contract: contract,
        method: "username",
        params: [winnerforRound ? winnerforRound : "0"],
        queryOptions: {
            enabled: !!winnerforRound,
        }
    });



    function truncate(value: string | number, decimalPlaces: number): number {
        const numericValue: number = Number(value);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be a convertible to a number.');
        }
        const factor: number = Math.pow(10, decimalPlaces);
        return Math.trunc(numericValue * factor) / factor;
    }

    // const winnerforRoundStr = winnerforRound ? winnerforRound.toString() : "0";
    // const currentRoundStr = currentRound ? currentRound.toString() : "0";
    const highestBid = highestBidforRound ? highestBidforRound.toString() : "0";
    const dividendAmount = dividendAmountforRound ? toEther(dividendAmountforRound).toString() : "0";
    const winningPot = winningPotforRound ? toEther(winningPotforRound).toString() : "0";


    if(winnerforRound !== admin){
        return(
            <div>
                { walletAddress == winnerforRound ? (
                    <div>
                        <p style={{marginTop: "20px", color: "green", marginBottom: "20px"}}>You win mfer</p>
                        { potWithdrawnforRound ? (
                            <div>
                                <button style={{backgroundColor: "green", color: "white"}}
                                >Withdrawn ✅</button>
                            </div>
                        ) : (
                            <div>
                                <TransactionButton style={{backgroundColor: "blue", color: "white"}}
                                    transaction={ () => (
                                        prepareContractCall({
                                            contract : contract,
                                            method : "cashout"
                                        })
                                    )}
                                    onTransactionConfirmed={() => alert("Success!!")}
                                >Cashout</TransactionButton>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p style={{marginTop: "10px", color: "blue"}}><b>winner : {userName}</b></p>
                        <p style={{color: "blue"}}><b>({winnerforRound})</b></p>
                    </div>
                )}
                <div style={{marginTop: "30px", color: "orange"}}>
                    <p>Winning Bid : {highestBid}%</p>
                    <p>Defaulters: {defaultersForRound?.toString()}</p>
                    <p>Prize Money: ₹{truncate(winningPot, 2)} IN₹</p>
                    <p>Discount: ₹{truncate(dividendAmount, 2)} IN₹</p>
                    <p></p>
                </div>
            </div>
        )
    } else {
        return(
            <div>
                <p>Pay/Bid deadline has passed. Winner will be annoounced soon !!</p>
            </div>
        )
    }
}