package com.example.tasks.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTaskReq {

    @NotBlank(message = "text 不能为空")
    @Size(min = 1, max = 100, message = "text 长度需在 1-100 之间")
    private String text;
}
