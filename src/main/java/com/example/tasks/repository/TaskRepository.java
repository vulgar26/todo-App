package com.example.tasks.repository;

import com.example.tasks.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByDone(Boolean done, Pageable pageable);

    Page<Task> findByTextContaining(String text, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.done = :done AND t.text Like %:text%")
    Page<Task> searchTasks(@Param("done") Boolean done,
                           @Param("text") String text,
                           Pageable pageable);
}
