package com.example.tasks.service;

import com.example.tasks.dto.CreateTaskReq;
import com.example.tasks.dto.TaskDto;
import com.example.tasks.dto.UpdateTaskReq;
import com.example.tasks.entity.Task;
import com.example.tasks.exception.TaskNotFoundException;
import com.example.tasks.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // 只读查询：@Transactional(readOnly = true) 可以少做一些检查、略提性能
    @Transactional(readOnly = true)
    public List<TaskDto> listAll() {
        return taskRepository.findAll().stream().map(this::toDto).toList();
    }

    // 新建：开启事务；save 后 Hibernate 会发 INSERT；id 会回填到实体
    @Transactional
    public TaskDto create(CreateTaskReq req) {
        Task t = new Task();
        t.setText(req.getText());
        t.setDone(false); // 默认未完成
        Task saved = taskRepository.save(t); // 触发 @PrePersist，写入时间戳
        return toDto(saved);
    }

    // 更新：先查（受管实体），改字段即可；提交时 Hibernate 自动发 UPDATE（脏检查）
    @Transactional
    public TaskDto update(Long id, UpdateTaskReq req) {
        Task t = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        if (req.getText() != null) t.setText(req.getText());
        if (req.getDone() != null) t.setDone(req.getDone());
        // 不需要显式 save（受管实体改了字段，提交时会自动 UPDATE），但写 save 也没问题
        return toDto(t);
    }

    @Transactional
    public void delete(Long id) {
        // 也可以先判断存在再删，这里简单起见直接删
        taskRepository.deleteById(id);
    }

    @Cacheable(value = "tasks", key = "#page + '-' + #size")
    public Page<TaskDto> searchTasks(int page, int size, Boolean done, String text, String sort) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(size, 1), 100);

        Sort sortObj = Sort.unsorted();
        String sortTextForMeta = null;
        if(sort != null && !sort.isBlank()){
            String[] parts = sort.split(",",2);
            String field = parts[0].trim();
            String dir = (parts.length > 1 ? parts[1].trim().toLowerCase() : "asc");
            Sort.Direction direction = "desc".equals(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sortObj = Sort.by(direction, field);
            sortTextForMeta = field + "," + direction.name().toLowerCase();
        }

        Pageable pageable = PageRequest.of(safePage, safeSize, sortObj);
        Page<Task> tasks = taskRepository.findAll(pageable);

        boolean hasText = (text != null && !text.isBlank());
        if (done != null && hasText) {
            tasks = taskRepository.searchTasks(done, text, pageable);
        } else if (done != null) {
            tasks = taskRepository.findByDone(done, pageable);
        } else if (hasText) {
            tasks = taskRepository.findByTextContaining(text, pageable);
        } else {
            tasks = taskRepository.findAll(pageable);
        }

        return tasks.map(task -> new TaskDto(task.getId(), task.getText(), task.getDone()));
    }

    private TaskDto toDto(Task t) {
        return new TaskDto(t.getId(), t.getText(), t.getDone());
    }
}
