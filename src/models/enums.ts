enum AppMessages {
    AUTHENTICATED = 'AUTHENTICATED SUCCESSFULLY',
    AUTHENTICATION_FAIL = 'FAILED AUTHENTICATION',
    ERROR_WHILE_GETTING_WS_CLIENT = 'Error while getting whatsapp client',
    CLIENT_EXIST = '¡Client already exist!'
}

enum WhatsappEvents {
    ON_AUTHENTICATED = 'authenticated',
    ON_AUTH_FAIL = 'auth_failure',
    ON_QR = 'qr',
    ON_DISCONNECTED = 'disconnected',
    ON_READY = 'ready',
    ON_MESSAGE = 'message',
    EMIT_LOADING = 'whatsapp-loading',
    EMIT_QR = 'whatsapp-qr-code',
    EMIT_READY = 'whatsapp-ready',
    EMIT_AUTH_SUCCESS = 'whatsapp-auth-success',
}

enum EcommerceEvents {
    EMIT_PUBLISHING = 'ecommerce-publishing',
    EMIT_PUBLISHED = 'ecommerce-item-published',
    EMIT_COMPLETED = 'ecommerce-completed',
    EMIT_FAILED = 'ecommerce-failed',
}

export {
  AppMessages,
  WhatsappEvents,
  EcommerceEvents,
};
