export interface Item {
    contract_decimals: number,
    contract_name: string,
    contract_ticker_symbol: string,
    contract_address: string,
    supports_erc: boolean,
    logo_url: string,
    type: string,
    balance: string,
    balance_24h: string,
    quote_rate: number,
    quote: number,
    nft_data: unknown
}



export interface BalanceResponse {
    data: {
        data: {
            address: string,
            updated_at: string,
            next_update_at: string,
            quote_currency: string,
            chain_id: number,
            items: Array<Item>,
            "pagination": null
        },
        "error": boolean,
        "error_message": null,
        "error_code": null
    },
}