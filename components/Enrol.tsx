'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../utils/contract";
import { prepareContractCall, toEther } from "thirdweb";

export const Enroll = () => {

    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const {
        data : slotsLeft,
    } = useReadContract({
        contract : contract,
        method : "slotsLeft"
    });

    const {
        data : slots,
    } = useReadContract({
        contract : contract,
        method : "slots"
    })

    const {
        data : instalmentAmount
    } = useReadContract({
        contract : contract,
        method : "maxContributionAmount"
    })

    const { data: isAllowed } = useReadContract({
        contract: contract,
        method: "isAllowed",
        params : [walletAddress],
        queryOptions: {
            enabled: !!account,
        },
    });

    

    if (isAllowed) {
        const slotsStr = slots !== undefined ? slots.toString() : "loading";
        const instalmentAmountStr = instalmentAmount !== undefined ? toEther(instalmentAmount).toString() : "loading";
        const potStr = (slots !== undefined && instalmentAmount !== undefined) ? 
                       (Number(slots) * Number(toEther(instalmentAmount))).toString() : 
                       "loading";

        return (
            <div style={{ textAlign: "center", minWidth: "500px" }}>
                <h2 style={{ marginTop: "20px", color: "red" }}>fund I</h2>
                <p style={{ marginTop: "10px", marginBottom: "20px", color: "green" }}>
                    slots left: {slotsLeft !== undefined ? slotsLeft.toString() : "loading"} / {slotsStr}
                </p>

                <TransactionButton
                    transaction={() => (
                        prepareContractCall({
                            contract: contract,
                            method: "enroll",
                        })
                    )}
                    onTransactionConfirmed={() => alert("success!")}
                >
                    ENROLL
                </TransactionButton>

                <p style={{ marginTop: "20px" }}> -- -- --</p>
                <p style={{ marginTop: "20px" }}>
                    Number of members – {slotsStr}
                </p>
                <p>
                    Maximum weekly instalment – {instalmentAmountStr} IN₹
                </p>
                <p>
                    Pot auction per round – {potStr} IN₹ ({slotsStr} members x {instalmentAmountStr} IN₹)
                </p>
                <p>Duration – {slotsStr} weeks! </p>
                <p style={{ marginTop: "20px", color: "orange" }}>Protocol fees - 1%</p>
                <p style={{ marginTop: "20px" }}> -- -- --</p>
            </div>
        );
    }
}