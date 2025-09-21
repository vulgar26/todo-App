package com.example.tasks.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // @Valid 触发的 Bean 校验失败（RequestBody）
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> onMethodArgNotValid(MethodArgumentNotValidException ex) {
        List<String> msgs = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msgs));
    }

    // @Validated + @PathVariable/@RequestParam 校验失败（如果你用到了）
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> onConstraintViolation(ConstraintViolationException ex) {
        List<String> msgs = ex.getConstraintViolations()
                .stream()
                .map(v -> v.getMessage())
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msgs));
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
