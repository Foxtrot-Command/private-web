import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
    1: process.env.RPC_URL_1 as string,
    4: process.env.RPC_URL_4 as string
}

export const Networks: Record<string, Record<string, string>> = {
    BSC: {
        chainId: "56",
        chainHex: '0x38',
        rpc: 'https://bsc-dataseed.binance.org/',
        explorer: 'https://bscscan.com/'
    },
    BSCTest: {
        chainId: "97",
        chainHex: '0x61',
        rpc: 'https://testnet.bsc-dataseed.binance.org/',
        explorer: 'https://testnet.bscscan.com/'
    },
    Local: {
        chainId: "31337",
        chainHex: '0x7A69',
        rpc: 'http://127.0.0.1:8545/',
        explorer: 'http://127.0.0.1:8545/explorer',
    }
}

export const defaultChain = Networks[process.env.NEXT_PUBLIC_DEFAULT_CHAIN!.toString()];

export const injected = new InjectedConnector({
    supportedChainIds: [
        Number(defaultChain.chainId),
    ]
})

export const walletconnect = new WalletConnectConnector({
    infuraId: '',
    rpc: {
        [defaultChain.chainId]: defaultChain.rpc
    },
    qrcode: true
})

export const network = new NetworkConnector({
    urls: { [Networks.Local.chainId]: Networks.BSC.rpc },
    defaultChainId: Number(Networks.Local.chainId)
})

export const walletlink = new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: 'Foxtrot Command Public Private Sale',
    supportedChainIds: [
        Number(Networks.BSC.chainId),
        Number(Networks.BSCTest.chainId),
        Number(Networks.Local.chainId)
    ]
})