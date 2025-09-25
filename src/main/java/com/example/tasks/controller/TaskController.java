package com.example.tasks.controller;

import com.example.tasks.dto.*;
import com.example.tasks.exception.ApiError;
import com.example.tasks.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "任务接口")
public class TaskController {

    private final TaskService taskService;
    public TaskController(TaskService taskService) { this.taskService = taskService; }

    @Operation(summary = "分页搜索任务", description = "支持分页、状态筛选与文本模糊")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "成功",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PageResponse.class))),
            @ApiResponse(responseCode = "401", description = "未认证"),
            @ApiResponse(responseCode = "403", description = "无权限")
    })
    @GetMapping
    public ResponseEntity<PageResponse<TaskDto>> searchTasks(
            @Parameter(description = "页码，从1开始") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "筛选是否完成") @RequestParam(required = false) Boolean done,
            @Parameter(description = "文本模糊查询") @RequestParam(required = false) String text,
            @Parameter(description = "排序字段, 如: created_at,desc") @RequestParam(required = false) String sort
    ) {
        Page<TaskDto> p = taskService.searchTasks(page - 1, size, done, text, sort);
        return ResponseEntity.ok(PageResponse.from(p)); // ✅ 用我们提供的 from(...)
    }

    @Operation(summary = "创建任务")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "已创建",
                    content = @Content(schema = @Schema(implementation = TaskDto.class))),
            @ApiResponse(responseCode = "400", description = "参数不合法",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<TaskDto> create(@Valid @RequestBody CreateTaskReq req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(req));
    }

    @Operation(summary = "修改任务")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "成功",
                    content = @Content(schema = @Schema(implementation = TaskDto.class))),
            @ApiResponse(responseCode = "404", description = "未找到",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}") // ✅ PATCH 更合适
    public ResponseEntity<TaskDto> update(@PathVariable Long id, @Valid @RequestBody UpdateTaskReq req) {
        return ResponseEntity.ok(taskService.update(id, req));
    }

    @Operation(summary = "删除任务")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "已删除"),
            @ApiResponse(responseCode = "404", description = "未找到",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
