package com.example.tasks.controller;

import com.example.tasks.dto.CreateTaskReq;
import com.example.tasks.dto.UpdateTaskReq;
import com.example.tasks.dto.TaskDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;                 // List 用来返回 JSON 数组

@RestController
@RequestMapping("/api/tasks")          // 所有方法路径统一加 "/api/tasks"
public class TaskController {

    @GetMapping                        // 处理 GET /api/tasks
    public List<TaskDto> list() {
        // 返回一个只有一条元素的列表：
        // new TaskDto(1L, "Demo task", false) 对应 { "id":1, "text":"Demo task", "done":false }
        return List.of(new TaskDto(1L, "Demo task", false));
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@Valid @RequestBody CreateTaskReq req) {
        var dto = new TaskDto(2L, req.getText(), false);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PostMapping("/{id}")
    public TaskDto update(@PathVariable Long id, @Valid @RequestBody UpdateTaskReq req) {
        String text = (req.getText() != null) ? req.getText() : "Demo task";
        Boolean done = (req.getDone() != null) ? req.getDone() : false;
        return new TaskDto(id, text, done);
    }
}
