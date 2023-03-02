import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import { Block, Loading } from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import { ApproveAllowance, Invest } from "helpers/web3";

export type Props = {
  value: number;
  library: Web3Provider | undefined;
  account: string | undefined | null;
  allowance: number | undefined;
  setUserAllowance: (value: React.SetStateAction<number | undefined>) => void;
};

export type TransactionData = {
  hash: string;
};

export const HandleInvest = async (props: Props) => {
  const { value, library, account, allowance, setUserAllowance } = props;
  const delay = 1200;

  if (!!(library && account) && allowance && allowance < 1000000) {
    Block.standard("#element", "Please wait...", {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      messageColor: "rgba(255, 255, 255, 0.8)",
    });

    await ApproveAllowance("busd", library)
      .then(async (data: any) => {
        library.once(data.hash, (transaction: { blockNumber: number }) => {
          if (transaction && transaction.blockNumber) {
            Block.remove("#element");
            Notify.success("Approved contract");
            setUserAllowance(1000000);
          }
          library.removeListener(data.hash, () => {});
        });
      })
      .catch((error) => {
        Block.remove("#element", delay);
        return error?.message !== undefined && Notify.failure(error.message);
      });
  } else {
    Loading.standard("Processing investment...", {
      svgColor: "#E51A29",
    });

    try {
      const investment = (await Invest(
        value.toString(),
        library
      )) as TransactionResponse;

      Notify.success(
        `Hash of the transaction: <a href="https://bscscan.com/tx/${investment.hash}">${investment.hash}</a>`,
        {
          timeout: delay + 1000,
          plainText: false,
          messageMaxLength: 200,
        }
      );

      Loading.change("Waiting for confirmation...");

      if (library) {
        library.once(investment.hash, (transaction: TransactionResponse) => {
          if (transaction && transaction.blockNumber) {
            Notify.success("Payment confirmed", {
              timeout: delay,
            });
            Loading.remove(delay);
          }
          library.removeListener(investment.hash, () => {});
        });
      }
    } catch (error: any) {
      Loading.remove();

      if (error?.data?.message !== undefined) {
        return Notify.failure(error.data.message);
      }

      if (String(error).includes("Not on the whitelist")) {
        return Notify.failure("You're not on the whitelist");
      }

      if (String(error).includes("execution reverted")) {
        return Notify.failure(error.toString());
      }

      return Notify.failure("Payment rejected");
    }
  }
};
