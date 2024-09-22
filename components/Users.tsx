import { useReadContract } from "thirdweb/react"
import { contract } from "../utils/contract"
import { useState } from "react"
import { UserCard } from "./UserCard";

export const Users = () => {
    const [user, setUser] = useState("");

    const {
        data : Participants,
        isLoading : isLoadingParticipants,
    } = useReadContract({
        contract : contract,
        method : "getParticipants"
    })


    return(
        <div className="flex flex-col items-center justify-center p-5">
            {!isLoadingParticipants && Participants!.length > 0 ? (
                Participants?.map((user, index) => (
                    <UserCard 
                        key = {index}
                        userId={index}
                        wallet={user}
                    />
                ))
            ) : (
                <div>
                    <p>No users have enrolled</p>
                </div>
            )}
        </div>
    )
}