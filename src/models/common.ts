export interface ICommonProductPublication {
    title: string,
    description: string,
    price: string,
    image: string,
}

export interface IFBMarketPlacePublication extends ICommonProductPublication{
    tags?: string,
}
