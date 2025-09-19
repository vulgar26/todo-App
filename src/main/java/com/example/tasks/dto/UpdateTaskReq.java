package com.example.tasks.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTaskReq {
    private Boolean done;

    @Size(min = 1, max = 100, message = "text 长度需在 1-100 之间")
    private String text;

    public Boolean getDone() { return done; }
    public void setDone() { this.done = done; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
