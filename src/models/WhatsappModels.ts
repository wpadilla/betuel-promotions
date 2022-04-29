export type WhatsappResponseStatusTypes = 'ready' | 'starting' | 'started' | 'logged out' | 'logged';

// responsde object for whatsapp endpoint
export class WhatsappResponse {
    loading?: boolean = false;

    initialized?: boolean;

    logged?: boolean;

    status?: WhatsappResponseStatusTypes;

    qrCode?: string;

    constructor(object: Partial<WhatsappResponse>) {
      this.loading = object.loading;
      this.initialized = object.initialized;
      this.logged = object.logged;
      this.status = object.status;
      this.qrCode = object.qrCode;
    }
}
