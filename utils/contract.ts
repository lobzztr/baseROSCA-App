import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { contractABI } from "./contractABI";
import { fiatContractABI } from "./fiatContractABI";

const contractAddress = "0x3C8943fd6Eb717a518E61191b1cE8885618B6963";

export const contract = getContract({
    client : client,
    chain : chain,
    address : contractAddress,
    abi : contractABI
});

const erc20FiatContractAddress = "0x42F253D3E3Ee7Dd8676DE6075c15A252879FA9cF";

export const erc20Contract = getContract({
    client : client,
    chain : chain,
    address : erc20FiatContractAddress,
    abi : fiatContractABI
});
