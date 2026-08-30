package com.lusotop.api.delivery;

public record DingConnectTransferResult(
        boolean success,
        String transferRef,
        String processingState,
        String errorMessage,
        ErrorKind errorKind
) {

    /**
     * Classificacao do erro para o resto da aplicacao decidir o que fazer: mostrar mensagem ao
     * cliente (numero invalido), bloquear o checkout sem cobrar (servico em baixo), ou reembolsar
     * uma cobranca ja feita.
     */
    public enum ErrorKind {
        NONE,
        /** 401/403/5xx/timeout/erro de rede -- problema nosso ou da DingConnect, nunca do cliente. */
        SERVICE_UNAVAILABLE,
        /** Numero de telefone invalido para a operadora escolhida -- corrigivel pelo cliente. */
        INVALID_ACCOUNT,
        /** SKU / SendValue / SendCurrency mal configurados -- problema nosso, nao do cliente. */
        INVALID_PRODUCT,
        /** Sem saldo/float na conta DingConnect -- problema nosso. */
        INSUFFICIENT_FLOAT,
        /** A transferencia ja tinha sido enviada (DistributorRef duplicado num retry). */
        ALREADY_SENT,
        UNKNOWN
    }

    public boolean retryable() {
        return errorKind == ErrorKind.SERVICE_UNAVAILABLE;
    }

    public static DingConnectTransferResult success(String transferRef, String processingState) {
        return new DingConnectTransferResult(true, transferRef, processingState, null, ErrorKind.NONE);
    }

    public static DingConnectTransferResult alreadySent() {
        return new DingConnectTransferResult(true, null, "AlreadySent", null, ErrorKind.ALREADY_SENT);
    }

    public static DingConnectTransferResult failure(String errorMessage, ErrorKind kind) {
        return new DingConnectTransferResult(false, null, null, errorMessage, kind);
    }

    public static DingConnectTransferResult failure(String errorMessage) {
        return failure(errorMessage, ErrorKind.UNKNOWN);
    }
}
