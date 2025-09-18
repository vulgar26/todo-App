package com.example.tasks.exception;

import jakarta.validation.ConstraintViolationException; // 参数/路径变量 校验失败抛的异常
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;       // 绑定失败（例如表单绑定）
import org.springframework.web.bind.MethodArgumentNotValidException; // @RequestBody + @Valid 校验失败
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestControllerAdvice // 声明：全局控制器增强，所有控制器抛出的异常都会先到这里
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> onMethodArgNotValid(MethodArgumentNotValidException ex) {
        // 拿到第一个校验错误的默认消息（通常来自注解 @NotBlank(message="...") 等）
        var msg = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(
                ApiError.builder().error("VALIDATION_ERROR").message(msg).build()
        );
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError> onBind(BindException ex) {
        var msg = ex.getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(
                ApiError.builder().error("VALIDATION_ERROR").message(msg).build()
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> onConstraint(ConstraintViolationException ex) {
        var msg = ex.getConstraintViolations().stream()
                .findFirst().map(v -> v.getMessage()).orElse("Invalid input");
        return ResponseEntity.badRequest().body(
                ApiError.builder().error("VALIDATION_ERROR").message(msg).build()
        );
    }

    @ExceptionHandler(Exception.class) // 兜底：任何没被上面匹配的异常
    public ResponseEntity<ApiError> onAny(Exception ex) {
        // 生产里你会在这里打日志（例如 logger.error）
        return ResponseEntity.status(500).body(
                ApiError.builder().error("INTERNAL_ERROR").message("Something went wrong").build()
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> onUnreadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(
                ApiError.builder().error("VALIDATION_ERROR").message("请求体缺失或JSON格式错误").build()
        );
    }
}
