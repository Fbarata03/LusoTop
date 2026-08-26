package com.lusotop.api.delivery;

public record DingConnectTransferResult(
        boolean success,
        String transferRef,
        String processingState,
        String errorMessage
) {

    public static DingConnectTransferResult success(String transferRef, String processingState) {
        return new DingConnectTransferResult(true, transferRef, processingState, null);
    }

    public static DingConnectTransferResult failure(String errorMessage) {
        return new DingConnectTransferResult(false, null, null, errorMessage);
    }
}
