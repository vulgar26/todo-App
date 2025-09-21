package com.example.tasks.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {
    private String error;
    private List<String> message;

    public static ApiError of(String error, List<String> messages) {
        return new ApiError(error, messages);
    }

    public static ApiError of(String error, String message) {
        return new ApiError(error, List.of(message));
    }
}
