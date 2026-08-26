package com.lusotop.api.order;

public enum DeliveryStatus {
    /** Pagamento ainda nao confirmado, ou confirmado mas o envio ainda nao foi tentado. */
    PENDING,
    /** SendTransfer da DingConnect confirmado com sucesso. */
    DELIVERED,
    /** SendTransfer falhou -- o pagamento e reembolsado automaticamente nesse caso. */
    FAILED
}
