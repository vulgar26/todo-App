package com.example.tasks.service;

import com.example.tasks.dto.CreateTaskReq;
import com.example.tasks.dto.TaskDto;
import com.example.tasks.dto.UpdateTaskReq;
import com.example.tasks.repository.TaskRepository;
import com.example.tasks.entity.Task;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.cache.type=none"
})
@Transactional
@Rollback
public class TaskServiceIT {

    @Autowired TaskService taskService;
    @Autowired TaskRepository taskRepository;

    @Test
    void create_update_delete_ok() {
        TaskDto created = taskService.create(new CreateTaskReq("hello mysql"));
        assertThat(created.getId()).isNotNull();
        assertThat(created.getDone()).isFalse();

        TaskDto updated = taskService.update(created.getId(), new UpdateTaskReq("hello updated", true));
        assertThat(updated.getText()).isEqualTo("hello updated");
        assertThat(updated.getDone()).isTrue();

        taskService.delete(created.getId());
        assertThat(taskRepository.findById(created.getId())).isEmpty();
    }

    @Test
    void search_with_pagination_ok() {
        taskService.create(new CreateTaskReq("A"));
        taskService.create(new CreateTaskReq("B"));

        Page<TaskDto> page1 = taskService.searchTasks(0, 1, null, null, null);
        assertThat(page1.getTotalElements()).isGreaterThanOrEqualTo(2);
        assertThat(page1.getContent()).hasSize(1);

        Page<TaskDto> page2 = taskService.searchTasks(1, 1, null, null, null);
        assertThat(page2.getContent()).hasSize(1);
    }
}
