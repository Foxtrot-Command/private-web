import { TransactionResponse } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import { BigNumber, Contract } from "ethers";
import { Notify } from "notiflix";

import { defaultChain } from "../../connectors";
import { CONTRACTS } from "../constants";

enum CONTRACT {
  PRIVATE = "private",
  BUSD = "busd",
  FXD = "fxd",
}
export function getContract(chainId: string, provider: any) {
  const contract = new Contract(
    CONTRACTS[chainId].address,
    CONTRACTS[chainId].abi,
    provider
  );
  const providerChainId = Number(BigNumber.from(provider.provider.chainId));

  return provider !== undefined &&
    Number(defaultChain.chainId) === providerChainId
    ? contract.connect(provider.getSigner())
    : undefined;
}

function masterPromise({ ...content }: any) {
  return new Promise(async (resolve, reject) => {
    const { chainId, provider, method, parameters } = content;
    const contract = getContract(chainId, provider);

    if (contract === undefined) {
      Notify.failure("Incorrect Network Provider");
      reject("Incorrect provider");
      return;
    }

    await contract?.[method](...parameters)
      .then((data: unknown, err: unknown) => {
        if (data) resolve(data);

        reject(err);
      })
      .catch((err: unknown) => {
        reject(err);
      });
  });
}

export async function ApproveAllowance(chainId: string, provider: any) {
  return new Promise(async (resolve, reject) => {
    const caller = getContract(chainId, provider);

    await caller
      ?.approve(CONTRACTS.private.address, parseEther("100000000000"))
      .then((data: any, err: any) => {
        if (data) {
          resolve(data);
        }
        reject(err);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

export function callWhitelistedAmountOf(address: string, provider: any) {
  return masterPromise({
    chainId: CONTRACT.PRIVATE,
    provider,
    method: "amount",
    parameters: [address],
  });
}

export async function Invest(amount: string, provider: any) {
  return (await masterPromise({
    chainId: CONTRACT.PRIVATE,
    provider,
    method: "invest",
    parameters: [parseEther(amount)],
  })) as TransactionResponse;
}

export function callAllowanceOf(
  address: string,
  chainId: string,
  provider: any
) {
  return new Promise(async (resolve, reject) => {
    const caller = getContract(chainId, provider);

    await caller
      ?.allowance(address, CONTRACTS.private.address)
      .then((data: any, err: any) => {
        if (data) {
          resolve(data);
        }
        reject(err);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

export function callBalanceOf(address: string, provider: any) {
  return masterPromise({
    chainId: CONTRACT.FXD,
    provider,
    method: "balanceOf",
    parameters: [address],
  });
}

export function claim(provider: any) {
  return masterPromise({
    chainId: CONTRACT.PRIVATE,
    provider,
    method: "claim",
    parameters: [],
  });
}

export function callTotals(method: string, address: string, provider: any) {
  return masterPromise({
    chainId: CONTRACT.PRIVATE,
    provider,
    method,
    parameters: [address],
  });
}

export function callTotalBusdInvested(provider: any) {
  return masterPromise({
    chainId: CONTRACT.PRIVATE,
    provider,
    method: "totalBusdInvested",
    parameters: [],
  });
}

export function callClaimStartAt(provider: any) {
  return new Promise(async (resolve, reject) => {
    const caller = getContract(CONTRACT.PRIVATE, provider);

    await caller
      ?.claimStartAt()
      .then((data: any, err: any) => {
        if (data) {
          resolve(data);
        }
        reject(err);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
