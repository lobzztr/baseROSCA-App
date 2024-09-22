'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { erc20Contract, contract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";

export const Contribute = () => {
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
    });

    const { data: dueAmount } = useReadContract({
        contract: contract,
        method: "contributionDueforRound",
        params: [currentRound ? currentRound : BigInt(0)],
        queryOptions: {
            enabled: !!currentRound
        }
    });

    const { data : hasPaid } = useReadContract({
        contract : contract,
        method: "hasPaidRound",
        params : [walletAddress, currentRound ? currentRound : BigInt(0)]
    });

    const dueAmountStr = dueAmount ? toEther(dueAmount).toString() : "0";

    if (!hasPaid) {
        return (
            <div>
                <h4 style={{ color: "green" }}>Contributions</h4>
                <p style={{ marginBottom: "10px", marginTop: "20px" }}>
                    ⚖️ : {userFiatBalance ? `${toEther(userFiatBalance).toString()} IN₹` : "Loading..."}
                </p>
                <TransactionButton 
                    transaction={ () => (
                        prepareContractCall({
                            contract : contract,
                            method : "contribute",
                        })
                    )}
                    onTransactionConfirmed={() => alert("Success!!")}
                >
                    Contribute ₹{dueAmountStr}
                </TransactionButton>
            </div>
        );
    } else {
        return (
            <div>
                <h4 style={{ color: "green" }}>Contribution</h4>
                <p style={{ marginBottom: "10px", marginTop: "20px" }}>
                    ⚖️ : {userFiatBalance ? `${toEther(userFiatBalance).toString()} IN₹` : "Loading..."}
                </p>
                <button style={{ backgroundColor: "green" }}>
                    Paid ₹{dueAmount ? toEther(dueAmount).toString() : "Loading..."} ✅
                </button>
            </div>
        )
    }

    return null;
};