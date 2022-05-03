import { EcommerceTypes } from '../utils/credentials';

export interface ICommonProductPublication {
    name: string,
    description: string,
    price: string,
    image: string,
    GodWord: string,
}

export interface IFBMarketPlacePublication extends ICommonProductPublication {
    tags?: string,
    brand?: string,
}

export type CommonResponseStatusTypes = 'started' | 'completed';

export class CommonResponse {
    loading?: boolean = false;

    status?: CommonResponseStatusTypes;
    error?: string;

    constructor(object: Partial<CommonResponse>) {
      this.loading = object.loading;
      this.status = object.status;
      this.error = object.error;
    }
}

export type ECommerceResponseStatusTypes = 'publishing' | 'published' | 'completed' | 'failed';

export type ECommerceSessionTypes = 'betueltgroup' | 'betueltravel';

export class ECommerceResponse {
    loading?: boolean = false;

    status: ECommerceResponseStatusTypes;

    ecommerce: EcommerceTypes;

    publication?: ICommonProductPublication | IFBMarketPlacePublication;

    error?: string;

    constructor(object: ECommerceResponse) {
      this.loading = object.loading;
      this.status = object.status;
      this.ecommerce = object.ecommerce;
      this.publication = object.publication;
      this.error = object.error;
    }
}
