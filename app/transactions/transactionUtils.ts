import {  SendOptions} from "web3-eth-contract";

const sendTransaction = async (tx: any, transactionConfig: SendOptions): Promise<any> => {

    const receipt = await tx.send(transactionConfig);
    const txHashesRaw: string | null = localStorage.getItem('txHashes');
    const txHashes = txHashesRaw ? JSON.parse(txHashesRaw) : {};
    console.log('receipt.transactionHash  '+receipt.transactionHash);

    if(txHashes[transactionConfig.from]) {
        txHashes[transactionConfig.from] = txHashes[transactionConfig.from].push(receipt.transactionHash);
    } else {
        txHashes[transactionConfig.from] = [receipt.transactionHash];
    }
    localStorage.setItem('txHashes', JSON.stringify(txHashes));
    return receipt;
};


const getTransactionHashes = (from: string): string[] =>  {

    const txHashesRaw: string | null = localStorage.getItem('txHashes');
    const txHashes = txHashesRaw ? JSON.parse(txHashesRaw) : {};
    return txHashes[from]  || []; 
}

export { sendTransaction, getTransactionHashes };