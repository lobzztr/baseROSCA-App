'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { contract, erc20Contract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";
import { Users } from "./Users";
import { Contribute } from "./Contribute";
import { Bid } from "./Bid";
import { Winner } from "./Winner";

export const Loop = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";


    const { data: userFiatBalance } = useReadContract({
        contract: erc20Contract,
        method: "balanceOf",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: currentRound } = useReadContract({
        contract: contract,
        method: "currentRound",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: slots } = useReadContract({
        contract: contract,
        method: "slots",
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: isParticipant } = useReadContract({
        contract: contract,
        method: "isParticipant",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account
        }
    });

    const { data: instalmentAmount } = useReadContract({
        contract: contract,
        method: "contributionDueforRound",
        params : [currentRound ?? BigInt(0)],
        queryOptions: {
            enabled: !!account
        }
    });


    const { data: totalPotforRound } = useReadContract({
        contract: contract,
        method: "totalContributionforRound",
        params: [currentRound ?? BigInt(0)], // Default to BigInt(0) if undefined
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: discountOfferedforRound } = useReadContract({
        contract: contract,
        method: "discountOfferedforRound",
        params: [currentRound ?? BigInt(0)], // Default to BigInt(0) if undefined
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: highestBidforRound } = useReadContract({
        contract: contract,
        method: "winningBidforRound",
        params: [currentRound ?? BigInt(0)], // Default to BigInt(0) if undefined
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: userBidforRound } = useReadContract({
        contract: contract,
        method: "participantBidforRound",
        params: [walletAddress, currentRound ?? BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data: userDeposits } = useReadContract({
        contract: contract,
        method: "userContributions",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account,
        }
    });

    const { data: userName } = useReadContract({
        contract: contract,
        method: "username",
        params: [walletAddress],
        queryOptions: {
            enabled: !!account,
        }
    });

    const { data: deadline } = useReadContract({
        contract: contract,
        method: "deadlineforRound",
        params: [currentRound ?? BigInt(0)],
        queryOptions: {
            enabled: !!account,
        }
    });

    function truncate(value: string | number, decimalPlaces: number): number {
        const numericValue: number = Number(value);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be convertible to a number.');
        }
        const factor: number = Math.pow(10, decimalPlaces);
        return Math.trunc(numericValue * factor) / factor;
    }

    if (isParticipant) {
        const currentRoundStr = currentRound?.toString() || "0";
        const slotsStr = slots?.toString() || "0";
        const instalmentAmountStr = instalmentAmount ? toEther(instalmentAmount).toString() : "0";
        const userDepositsStr = userDeposits ? toEther(userDeposits).toString() : "0";
        const totalPotforRoundStr = totalPotforRound ? toEther(totalPotforRound).toString() : "0";
        const highestBidforRoundStr = highestBidforRound ? highestBidforRound.toString() : "0";
        const userBidforRoundStr = userBidforRound ? userBidforRound.toString() : "0";

        const formatTime = (seconds: number): string => {
            const date = new Date(seconds * 1000); // Convert seconds to milliseconds
            return date.toLocaleTimeString(); // Extract HH:MM:SS part from ISO string
          };

        return (
            <div style={{ textAlign: "center", minWidth: "500px", marginTop: "10px" }}>
                <h2 style={{ marginTop: "20px", color: "red", marginBottom: "10px" }}>fund I</h2>
                <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px" }}>
                    <p style={{ color: "green" }}>{userName}'s account :</p>
                    <p style={{ color: "grey" }}>💰 Contributions: ₹{truncate(userDepositsStr, 2)} IN₹</p>
                    <p style={{ color: "grey" }}>
                        ⚖️ : ₹{userFiatBalance ? ` ${toEther(userFiatBalance).toString()} IN₹` : "Loading..."}
                    </p>
                </div>
                <h3 style={{ marginTop: "20px", color: "green" }}>
                    ROUND : {currentRoundStr} / {slots?.toString() || "0"}
                </h3>
                <p style={{ color: "red", marginTop: "10px" }}>Deadline: {deadline ? formatTime(Number(deadline)) : "No deadline set"}</p>
                {/* Deadline: {formatTime(deadline)} */}
                {currentRoundStr === "0" ? (
                    <div>
                        <p>Waiting for all members to join. Round 1 will start soon!!</p>
                        <p style={{ marginBottom: "20px", color:"orange", marginTop: "20px" }}>
                            Please approve the chit contract for IN₹ token in the meantime for ₹{instalmentAmountStr} IN₹ !!
                        </p>
                    </div>
                ) : deadline && Date.now() < Number(deadline) * 1000 ? (
                    <div style={{ textAlign: "center", minWidth: "500px", marginTop: "10px" }}>                                                
                        <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px", marginTop: "20px" }}>
                            <p style={{ color: "green" }}>Active Pot: ₹{totalPotforRoundStr} IN₹</p>
                            <p style={{ color: "red" }}>Highest Bid: {highestBidforRoundStr}%</p>
                        </div>
                        <p>=====================================</p>
                        <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px", marginTop: "20px", marginBottom: "20px" }}>
                            <div>
                                <Contribute />
                            </div>
                            <div>
                                <Bid />
                            </div>                            
                        </div>
                        <div>
                            <p style={{ color: "green", marginTop: "30px" }}><b>Your bid: {userBidforRoundStr}%</b></p>
                            <p style={{ color: "orange", marginBottom: "20px" }}>New bids must exceed the highest active bid !!</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p style={{ color: "green", marginTop: "30px", marginBottom: "20px" }}>
                            =====================================
                        </p>

                        <Winner />

                        <p style={{ color: "green", marginTop: "30px", marginBottom: "20px" }}>
                            =====================================
                        </p>
                    </div>
                )}
                

                <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10px", marginTop: "20px", marginBottom: "20px" }}>
                    <div>
                        <Users />
                    </div>
                    <TransactionButton
                        style={{ flex: 1, backgroundColor: "pink", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                        transaction={() => (
                            prepareContractCall({
                                contract: erc20Contract,
                                method: "approve",
                                params: [contract.address, BigInt(10000 * 10**18) ]
                            })
                        )}
                    >Approve</TransactionButton>
                </div>
            </div>
        )
    }
    return null;
}