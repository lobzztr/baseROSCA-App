'use client';
import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../utils/contract";
import { Admin } from "./Admin";
import { Dashboard } from "./Dashboard";
import { Stranger } from "./Stranger";

export const ROSCA = () => {
    const account = useActiveAccount();
    const walletAddress = account ? account.address : "";

    const { data : admin } = useReadContract({
        contract : contract,
        method : "admin",
        queryOptions : {
            enabled: !!account,
        }
    });

    const { data : user } = useReadContract({
        contract : contract,
        method : "isAllowed",
        params : [walletAddress],
        queryOptions : {
            enabled: !!walletAddress,
        }
    });

    if (walletAddress == admin){
        return(
            <div className="flex flex-col items-center justify-center p-5">
                <ConnectButton
                    client={client}
                    chain={chain}
                />
                <Admin />
            </div>
        )
    } else if (user){
        return(
            <div className="flex flex-col items-center justify-center p-5">
                <ConnectButton
                    client={client}
                    chain={chain}
                />
                <div className="flex justify-between items-start mb-6">
                    <Dashboard />
                </div>
            </div>
        )
    } else {
        return(
            <div className="flex flex-col items-center justify-center p-5">
                <ConnectButton
                    client={client}
                    chain={chain}
                />
                <Stranger />                
            </div>
        )
    }
};