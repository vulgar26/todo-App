package com.example.tasks.controller;

import com.example.tasks.dto.CreateTaskReq;
import com.example.tasks.dto.PageResponse;
import com.example.tasks.dto.UpdateTaskReq;
import com.example.tasks.dto.TaskDto;
import com.example.tasks.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;                 // List 用来返回 JSON 数组

@RestController
@RequestMapping("/api/tasks")          // 所有方法路径统一加 "/api/tasks"
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@Valid @RequestBody CreateTaskReq req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(req));
    }

    @PostMapping("/{id}")
    public TaskDto update(@PathVariable Long id, @Valid @RequestBody UpdateTaskReq req) {
        return taskService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public PageResponse<TaskDto> searchTasks(
            @RequestParam(name = "page", defaultValue = "1") int page1,
            @RequestParam(name = "size", defaultValue = "10") int sizeParam,
            @RequestParam(name = "limit", required = false) Integer limitParam,
            @RequestParam(required = false) Boolean done,
            @RequestParam(name = "text", required = false) String text,
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "sort", required = false) String sort
    ) {
        int size = (limitParam != null ? limitParam : sizeParam);
        String keyword = (q != null && !q.isBlank()) ? q : text;

        int page0 = Math.max(0, page1 - 1);

        var pg = taskService.searchTasks(page0, size, done, keyword, sort);

        return PageResponse.from(pg, page1, size, sort);
    }
}
