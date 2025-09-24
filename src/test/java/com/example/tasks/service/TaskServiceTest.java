package com.example.tasks.service;

import com.example.tasks.dto.CreateTaskReq;
import com.example.tasks.dto.TaskDto;
import com.example.tasks.entity.Task;
import com.example.tasks.repository.TaskRepository;
import com.example.tasks.exception.TaskNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {
    @Mock TaskRepository taskRepository;
    @InjectMocks TaskService taskService;

    @Test
    void create_shouldFillDefaultsAndPersist() {
        var req = new CreateTaskReq();
        req.setText("hello");

        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> {
            Task t = inv.getArgument(0);
            t.setId(1L);
            return t;
        });

        TaskDto dto = taskService.create(req);

        assertEquals("hello", dto.getText());
        assertFalse(dto.getDone());
        verify(taskRepository).save(argThat(t -> "hello".equals(t.getText()) && !t.getDone()));
    }
    @Test
    void update_nonExist_shouldThrow() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(TaskNotFoundException.class,
                () -> taskService.update(999L, null));
    }
}
