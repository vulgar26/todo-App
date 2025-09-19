package com.example.tasks.entity;

import jakarta.persistence.*;                 // JPA 注解都在这里
import java.time.LocalDateTime;

@Entity                      // 声明“这是一个持久化实体”，会映射成一张表
@Table(name = "tasks")      // 表名；不写默认按类名
public class Task {

    @Id                                  // 主键列
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自增 ID（H2 支持）
    private Long id;

    @Column(nullable = false, length = 100)   // 数据库层面的非空 + 长度约束
    private String text;

    @Column(nullable = false)                 // 业务上我们默认 false，但列也强制非空
    private Boolean done = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // —— 生命周期回调：持久化/更新前自动写时间戳 ——
    @PrePersist
    public void prePersist() {
        var now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // —— Getter/Setter：你有 Lombok 也可以用 @Data，没开注解处理就手写 ——
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Boolean getDone() { return done; }
    public void setDone(Boolean done) { this.done = done; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
