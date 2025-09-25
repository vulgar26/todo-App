package com.example.tasks.controller;

import com.example.tasks.dto.TaskDto;
import com.example.tasks.security.JwtProvider;
import com.example.tasks.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*; // ✅ 正确
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TaskController.class)
@ActiveProfiles("test")
class TaskControllerIT {

    @Autowired
    MockMvc mvc;

    // 控制返回，避免连 DB
    @MockitoBean
    TaskService taskService;

    // 关键：切片测试中把 JwtProvider 也 mock 掉，保证安全链能初始化
    @MockitoBean
    JwtProvider jwtProvider;

    @Test
    void unauthorized_should401() throws Exception {
        mvc.perform(get("/api/tasks?page=1&size=10"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void list_ok_should200() throws Exception {
        Page<TaskDto> page = new PageImpl<>(
                List.of(new TaskDto(1L, "A", false)),
                PageRequest.of(0, 10),
                1
        );
        when(taskService.searchTasks(0, 10, null, null, null)).thenReturn(page);

        mvc.perform(get("/api/tasks?page=1&size=10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser
    void create_invalidBody_should400() throws Exception {
        mvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"\"}")
                        .with(csrf()))
                .andExpect(status().isBadRequest());
    }
}
