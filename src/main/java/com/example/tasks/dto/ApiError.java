package com.example.tasks.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "统一错误响应")
public class ApiError implements Serializable {
    @Schema(description = "错误码（例如 BAD_REQUEST / NOT_FOUND / INTERNAL_ERROR）", example = "BAD_REQUEST")
    private String code;

    @Schema(description = "错误消息", example = "text 不能为空")
    private String message;
}

