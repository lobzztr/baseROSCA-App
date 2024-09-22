'use client';

import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../utils/contract";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";

export const Bid = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const [bid, setBid] = useState<number>(2);

    const { data: currentRound } = useReadContract({
        contract: contract,
        method: "currentRound",
    });

    const { data: slots } = useReadContract({
        contract: contract,
        method: "slots",
    });

    const { data: hasPaid } = useReadContract({
        contract: contract,
        method: "hasPaidRound",
        params: [walletAddress ?? "", currentRound ?? BigInt(0)],
        queryOptions: {
            enabled: !!currentRound,
        },
    });

    const { data: hasWon } = useReadContract({
        contract: contract,
        method: "hasWon",
        params: [walletAddress ?? ""],
        queryOptions: {
            enabled: !!currentRound,
        },
    });

    if (currentRound !== slots && hasPaid && !hasWon) {
        return (
            <div>
                <h4 style={{ color: "green" }}>Bids</h4>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <input
                        type="number"
                        value={bid}
                        onChange={(e) => setBid(Number(e.target.value))}
                        placeholder="2% to 21%"
                        style={{
                            width: "100px",
                            color: "orange",
                            backgroundColor: "black",
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            marginTop: "10px",
                            marginBottom: "5px",
                            maxWidth: "100px",
                            textAlign: "right",
                        }}
                        step={1}
                        min={2}
                        max={21}
                    />
                    <TransactionButton
                        transaction={async () => {
                            return prepareContractCall({
                                contract: contract,
                                method: "bid",
                                params: [BigInt(bid)]
                            });
                        }}
                        onTransactionConfirmed={() => alert("Success!!")}
                    >
                        Bid
                    </TransactionButton>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ width: "150px" }}>
                <h4 style={{ color: "green" }}>Bids</h4>
                <p style={{ wordWrap: "break-word", marginTop: "25px", color: "orange" }}>
                    Finish the payment to submit your bid !!
                </p>
                <p style={{ wordWrap: "break-word", marginTop: "15px", color: "orange" }}>
                    Previous winners cannot bid again !!
                </p>
            </div>
        );
    }
};