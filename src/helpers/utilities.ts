import { Networks, defaultChain } from "../../connectors";

export function ellipseAddress(address = "", width = 5): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function cleanRevertMessage(message: string) {
  const messageParts = message.split("FXD: ");
  return messageParts[1];
}

export function getTokenRate(amount: number) {
  return amount / Number(process.env.NEXT_PUBLIC_TOKEN_RATE);
}

export function numberWithCommas(value: number) {
  return value.toString().replace(/\./g, ",");
}

interface IWeb3Asset {
  token: {
    address: string;
    symbol: string;
    image?: string;
  };
  provider: any;
  account: string;
}

export async function addWeb3Asset({ provider, account, token }: IWeb3Asset) {
  if (provider && account) {
    return new Promise(async (resolve, reject) => {
      const { ethereum } = window as any;

      await ethereum
        .request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: 18,
              image: token.image,
            },
          },
        })
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
}

export async function switchNetwork() {
  return new Promise(async (resolve, reject) => {
    const { ethereum } = window as any;

    await ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: defaultChain.chainHex, // Networks.BSC.chainHex,
          },
        ],
      })
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
