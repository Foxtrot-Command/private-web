const erc20 = require("./contracts/ERC20.json");
const fxd_abi = require("./contracts/ERC20FoxtrotCommand.json");
const sale_abi = require("./contracts/FoxtrotPrivateSale.json");

export interface ContractSetup {
  address: string;
  abi: any;
}

export const CONTRACTS: { [name: string]: ContractSetup } = {
  private1: {
    address: process.env.NEXT_PUBLIC_PRIVATE_ONE_CONTRACT || "0x0",
    abi: sale_abi.abi,
  },
  busd: {
    address: process.env.NEXT_PUBLIC_BUSD_CONTRACT || "0x0",
    abi: erc20.abi,
  },
  fxd: {
    address: process.env.NEXT_PUBLIC_FXD_CONTRACT || "0x0",
    abi: fxd_abi.abi,
  },
};