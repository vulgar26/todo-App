package com.example.tasks.exception;

import lombok.Builder;  // 允许我们用 ApiError.builder().error("..").message("..").build()
import lombok.Data;

@Data
@Builder
public class ApiError {
    private String error;    // 错误类型标识（例如 VALIDATION_ERROR, INTERNAL_ERROR）
    private String message;  // 给前端看的提示信息
}
