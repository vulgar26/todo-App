package com.example.tasks.repository;

import com.example.tasks.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // 啥都不用写，save/findAll/findById/deleteById 全都有
}
