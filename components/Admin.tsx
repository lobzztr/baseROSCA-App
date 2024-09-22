'use client';

import { TransactionButton, useReadContract } from "thirdweb/react";
import { contract, erc20Contract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";
import { Users } from "./Users";

export const Admin = () => {

    const { data : slots } = useReadContract({
        contract : contract,
        method : "slots"
    });

    const { data : currentRound } = useReadContract({
        contract : contract,
        method : "currentRound"
    });

    const {
        data : status,
        isLoading : isLoadingStatus
    } = useReadContract({
        contract : contract,
        method : "statusROSCA"
    });

    const {
        data : insurance,
        isLoading : isLoadingInsurance,
    } = useReadContract({
        contract : contract,
        method : "insuranceBudget"
    });

    

    return(
        <div className="flex flex-col items-center justify-center p-5">

            <p className="text-black-500 font-comfortaa">
                Security Budget: ₹{ !isLoadingInsurance && insurance !== undefined ? (
                    toEther(insurance).toString()
                ) : (
                    toEther(BigInt(0)).toString()
                )}
            </p>

            
            {!isLoadingStatus && !status ? (
                <div>
                    <p className="mb-10 text-black-500 font-comfortaa">Fund Status: ❌</p>
                </div>
            ) : (
                <div>
                    <p className="text-black-500 font-comfortaa">Fund Status: ✅</p>
                    <p className="mb-10 text-black-500 font-comfortaa"> Round : {currentRound?.toString()} / {slots?.toString()} </p>
                </div>
            )}
            <div className="mb-10 text-black-500 font-comfortaa" style={{ display: "flex", gap: "10px" }}>
                <TransactionButton
                    style={{ flex: 1, backgroundColor: "white", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: erc20Contract,
                            method: "approve",
                            params: [contract.address, BigInt(10000 * 10**18) ]
                        })
                    )}
                >Approve</TransactionButton>

                <TransactionButton
                    style={{ flex: 1, backgroundColor: "white", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "startROSCAInstance",
                            params: [BigInt(6), BigInt(1000), BigInt(100), BigInt(604800)]
                        })
                    )}
                >Start ROSCA</TransactionButton>

                <TransactionButton
                    style={{ flex: 1, backgroundColor: "white", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "vettUser",
                            // params: ["0xaB6B7560f46F22DFa3e1BaAFa2c8918223C88Ab6", "wolf"]
                            params: ["0x4fABc1CCd1e0Df96c5258394069fd333470f2bE0", "testy"]
                            // params: ["0xfaA8A82153cc79eAb5b74EF3583DD54822189b2A", "viber"]
                            
                        })
                    )}
                >Allowlist User</TransactionButton>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <TransactionButton
                    style={{ flex: 1, backgroundColor: "pink", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "securityGuarantee",
                        })
                    )}
                >Insure</TransactionButton>

                <TransactionButton
                    style={{ flex: 1, backgroundColor: "pink", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "startLoop",
                        })
                    )}
                >Start Loop</TransactionButton>

                <TransactionButton
                    style={{ flex: 1, backgroundColor: "pink", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "prizeMoney",
                        })
                    )}
                >Prize Money</TransactionButton>
                <TransactionButton
                    style={{ flex: 1, backgroundColor: "blue", color: "black", border: "2px solid black", borderRadius: "8px", fontFamily: "comfortaa" }}
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "fulfillPrizeWinnerInfo",
                        })
                    )}
                >fullfill Raffle</TransactionButton>
            </div>

            <Users/>
        </div>
    )
};