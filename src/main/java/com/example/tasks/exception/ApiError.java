package com.example.tasks.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "统一错误返回结构")
public class ApiError implements Serializable {

    @Schema(description = "错误码", example = "VALIDATION_ERROR")
    private String code;

    @Schema(description = "错误信息列表")
    private List<String> messages;

    // 便捷工厂：单条消息
    public static ApiError of(String code, String message) {
        return new ApiError(code, List.of(message));
    }

    // 便捷工厂：多条消息
    public static ApiError of(String code, List<String> messages) {
        return new ApiError(code, messages);
    }
}
