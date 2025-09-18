package com.example.tasks.dto;

import lombok.AllArgsConstructor;  // Lombok：自动生成全参构造函数
import lombok.Data;                // Lombok：自动生成 getter/setter/toString/equals/hashCode
import lombok.NoArgsConstructor;   // Lombok：自动生成无参构造函数

@Data                              // 让类的样板代码自动生成（省去手写 getter/setter）
@NoArgsConstructor                 // 需要无参构造，方便序列化/反序列化
@AllArgsConstructor                // 需要全参构造，便于快速 new
public class TaskDto {
    private Long id;               // 任务 id（长整型）
    private String text;           // 任务文本内容（前端字段名对齐：text）
    private Boolean done;          // 是否完成（前端字段名对齐：done）
}
