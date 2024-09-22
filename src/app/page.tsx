import { ConnectEmbed, ConnectButton } from "@/app/thirdweb";
import { chain } from "./chain";
import { client } from "./client";
import { ROSCA } from "../../components/ROSCA";
// import { ConnectButton } from "thirdweb/react";

export default function Home() {

  

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h2 className="mt-16 mb-2 text-black-500 text-4xl font-comfortaa">rosca</h2>
      <p className="mb-6 text-black-500 text-lg font-comfortaa">on-chain rotating savings and credit protocol</p>
      {/* <ConnectEmbed client={client} chain={chain} /> */}
      <ROSCA/>
    </div>
  );
}
