import {  SendOptions} from "web3-eth-contract";

const sendTransaction = async (tx: any, transactionConfig: SendOptions): Promise<any> => {

    const receipt = await tx.send(transactionConfig);
    const txHashesRaw: string | null = localStorage.getItem('txHashes');
    const txHashes = txHashesRaw ? JSON.parse(txHashesRaw) : [];
    console.log('receipt.transactionHash  '+receipt.transactionHash);
    txHashes.push(receipt.transactionHash);
    localStorage.setItem('txHashes', JSON.stringify(txHashes));
    return receipt;
};

export { sendTransaction };