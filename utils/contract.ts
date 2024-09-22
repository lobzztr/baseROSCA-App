import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { contractABI } from "./contractABI";
import { fiatContractABI } from "./fiatContractABI";

const contractAddress = "0x66DC444e2cD04AbCb19861387c9F7E1B4EC6E7Bc";

export const contract = getContract({
    client : client,
    chain : chain,
    address : contractAddress,
    abi : contractABI
});

const erc20FiatContractAddress = "0xA755f72E3106C7e59D269A2FB0Bacb5a5373fC6A";

export const erc20Contract = getContract({
    client : client,
    chain : chain,
    address : erc20FiatContractAddress,
    abi : fiatContractABI
});