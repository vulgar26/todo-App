package com.example.tasks.service;

import com.example.tasks.dto.CreateTaskReq;
import com.example.tasks.dto.TaskDto;
import com.example.tasks.repository.TaskRepository;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assumptions.assumeTrue;
import static org.mockito.Mockito.*;

import java.net.InetSocketAddress;
import java.net.Socket;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.cache.type=redis",
        "spring.redis.host=localhost",
        "spring.redis.port=6379",
        "spring.cache.redis.time-to-live=600000"
})
@Transactional
public class TaskCacheIT {
    @Autowired TaskService taskService;

    @MockitoSpyBean TaskRepository taskRepository;

    static boolean redisUp() {
        try (Socket s = new Socket()) {
            s.connect(new InetSocketAddress("127.0.0.1", 6379), 200);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @BeforeEach
    void checkRedis() {
        assumeTrue(redisUp(), "Skip: Redis not reachable");
    }

    @Test
    void search_cached_then_evict_on_write() {
        TaskDto t = taskService.create(new CreateTaskReq("cache-me"));

        Mockito.clearInvocations(taskRepository);
        Page<TaskDto> p1 = taskService.searchTasks(0, 10, null, null, null);
        verify(taskRepository, atLeastOnce()).findAll(any(PageRequest.class));

        Mockito.clearInvocations(taskRepository);
        Page<TaskDto> p2 = taskService.searchTasks(0, 10, null, null, null);
        verify(taskRepository, times(0)).findAll(any(PageRequest.class));

        Mockito.clearInvocations(taskRepository);
        taskService.update(t.getId(), new com.example.tasks.dto.UpdateTaskReq("cache-bust", true));

        Page<TaskDto> p3 = taskService.searchTasks(0, 10, null, null, null);
        verify(taskRepository, atLeastOnce()).findAll(any(PageRequest.class));
    }
}