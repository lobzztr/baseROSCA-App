'use client';

import { useReadContract } from "thirdweb/react";
import { contract } from "../utils/contract";

type UserProps = {
    userId: number;
    wallet: string;
};

export const UserCard = ({ userId, wallet }: UserProps) => {

    // Fetch username
    const { data: username } = useReadContract({
        contract: contract,
        method: "username",
        params: [wallet]
    });

    // Fetch number of slots
    const { data: slots } = useReadContract({
        contract: contract,
        method: "slots",
    });

    // Initialize state to store hasPaidRound for each slot
    const hasPaidRounds: boolean[] = [];
    // const hasWonRounds: boolean[] = [];

    // Iterate over slots and fetch hasPaidRound status
    if (slots) {
        for (let j = 1; j <= Number(slots); j++) {
            const { data: hasPaidRound } = useReadContract({
                contract: contract,
                method: "hasPaidRound",
                params: [wallet, BigInt(j)],
            });

            // Store the result in hasPaidRounds array
            hasPaidRounds[j - 1] = !!hasPaidRound;
        }
        // for (let k = 1; k <= Number(slots); k==){
        //     const { data: hasWonRounds } = useReadContract({
        //         contract: contract,
        //         method: "hasPaidRound",
        //         params: [wallet, BigInt(j)],
        //     });
        // }
    }

    return (
        <div>
            <div style={{ display: "flex", gap: "10px" }}>
                <p style={{ flexBasis: "100px" }}>⭕️</p>
                <p style={{ flexBasis: "100px" }}>{username ?? "Loading..."}</p>
                {hasPaidRounds.map((hasPaid, index) => (
                    <p key={index} style={{ flexBasis: "100px" }}>
                        {hasPaid ? "✅" : "❌"}
                    </p>
                ))}
            </div>
        </div>

    );
};