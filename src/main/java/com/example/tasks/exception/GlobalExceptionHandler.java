package com.example.tasks.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // @Valid 触发的 Bean 校验失败（RequestBody）
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> onMethodArgNotValid(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msg));
    }

    // @Validated + @PathVariable/@RequestParam 校验失败（如果你用到了）
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> onConstraintViolation(ConstraintViolationException ex) {
        String msg = ex.getConstraintViolations().iterator().next().getMessage();
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msg));
    }

    // 请求体缺失 / JSON 语法错误
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> onUnreadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", "请求体缺失或 JSON 格式错误"));
    }

    // 资源找不到（Service 抛 TaskNotFoundException）
    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<ApiError> onNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(404).body(ApiError.of("NOT_FOUND", ex.getMessage()));
    }

    // 兜底：未知异常 → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> onAny(Exception ex) {
        return ResponseEntity.status(500).body(ApiError.of("INTERNAL_ERROR", "Something went wrong"));
    }
}
