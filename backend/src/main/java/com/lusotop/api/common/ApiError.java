package com.lusotop.api.common;

public record ApiError(String code, String message, String reference) {

    public static ApiError of(String code, String message) {
        return new ApiError(code, message, null);
    }
}
