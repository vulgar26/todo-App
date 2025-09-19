package com.example.tasks.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {
    private String error;
    private String message;

    public static ApiError of(String error, String message) {
        return new ApiError(error, message);
    }
}
