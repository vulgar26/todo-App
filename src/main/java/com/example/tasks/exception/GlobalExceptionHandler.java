package com.example.tasks.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@RestControllerAdvice // 等价于 @ControllerAdvice + @ResponseBody
public class GlobalExceptionHandler {

    // @Valid 触发的 Bean 校验失败（RequestBody）
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgNotValid(MethodArgumentNotValidException ex) {
        List<String> msgs = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msgs));
    }

    // @Validated + @PathVariable/@RequestParam 校验失败
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> msgs = ex.getConstraintViolations()
                .stream()
                .map(v -> v.getMessage())
                .toList();

        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msgs));
    }

    // 请求体缺失 / JSON 语法错误
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", "请求体缺失或 JSON 格式错误"));
    }

    // 资源找不到（例如 Service 抛 TaskNotFoundException）
    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiError.of("NOT_FOUND", ex.getMessage()));
    }

    // 兜底：未知异常 → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleOthers(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of("INTERNAL_ERROR", "Something went wrong"));
    }
}
