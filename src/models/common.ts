export interface ICommonProductPublication {
    name: string,
    description: string,
    price: string,
    image: string,
    GodWord: string,
}

export interface IFBMarketPlacePublication extends ICommonProductPublication{
    tags?: string,
    brand?: string,
}
