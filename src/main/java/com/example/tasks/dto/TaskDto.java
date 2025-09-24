package com.example.tasks.dto;

import lombok.AllArgsConstructor;  // Lombok：自动生成全参构造函数
import lombok.Data;                // Lombok：自动生成 getter/setter/toString/equals/hashCode
import lombok.NoArgsConstructor;   // Lombok：自动生成无参构造函数
import java.io.Serializable;
import io.swagger.v3.oas.annotations.media.Schema;

@Data                              // 让类的样板代码自动生成（省去手写 getter/setter）
@NoArgsConstructor                 // 需要无参构造，方便序列化/反序列化
@AllArgsConstructor                // 需要全参构造，便于快速 new
@Schema(description = "任务对外展示对象")
public class TaskDto implements Serializable {
    private static final long serialVersionUID = 1L;

    @Schema(description = "任务ID", example = "123")
    private Long id;               // 任务 id（长整型）

    @Schema(description = "内容", example = "But milk")
    private String text;           // 任务文本内容（前端字段名对齐：text）

    @Schema(description = "是否完成", example = "false")
    private Boolean done;          // 是否完成（前端字段名对齐：done）
}
