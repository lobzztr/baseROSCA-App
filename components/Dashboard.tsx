import { XIcon, CheckIcon, AlertTriangleIcon } from "lucide-react"
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../utils/contract";
import { Enroll } from "./Enrol";
import { Loop } from "./Loop";


export const Dashboard = () => {

  const account = useActiveAccount();
  const walletAddress = account ? account.address : "";

  const { data : isParticipant } = useReadContract({
    contract : contract,
    method : "isParticipant",
    params : [walletAddress]
  });

  const { data : slotsleft } = useReadContract({
    contract : contract,
    method : "slotsLeft"
});


  if( slotsleft !== undefined && isParticipant !== undefined){
    return (
      <div className="flex flex-col items-center justify-center p-5">
        {!isParticipant && slotsleft > 0 ? (
          <div className="flex flex-col items-center justify-center p-5">
            <Enroll />
          </div>
        ) : isParticipant ? (
          <div className="flex flex-col items-center justify-center p-5">
            <Loop />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-5">
            <h5 className="mt-10 mb-2 text-black-500 text-4xl font-comfortaa">slots full</h5>
            <p className="mb-6 text-black-500 text-lg font-comfortaa">please wait for a new rosca to start</p>
          </div>
        )}
      </div>
    )
  }
  
}