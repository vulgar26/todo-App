package com.example.tasks.controller;

import org.springframework.http.ResponseEntity;     // 用于更灵活地返回 HTTP 响应
import org.springframework.web.bind.annotation.*; // 导入 Web 注解（@RestController 等）
import java.util.Map;                              // Map 用来构造 {"status":"ok"} 这种键值对

@RestController                                    // 声明：这是一个 REST 控制器，返回 JSON
@RequestMapping("/api/health")                     // 给这个控制器的所有方法统一加上前缀路径
public class HealthController {

    @GetMapping                                   // 处理 GET 请求（等价于 GET /api/health）
    public ResponseEntity<Map<String, Object>> health() {
        // Map.of(...) 快速构造一个不可变 Map：{"status": "ok"}
        // ResponseEntity.ok(...) 表示 HTTP 200 状态 + JSON Body
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
