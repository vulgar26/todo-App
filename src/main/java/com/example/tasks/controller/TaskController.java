package com.example.tasks.controller;

import com.example.tasks.dto.TaskDto;  // 引入我们刚才定义的 DTO
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
}
