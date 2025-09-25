package com.example.tasks.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.domain.Page;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "分页响应包装")
public class PageResponse<T> implements Serializable {

    @Schema(description = "数据列表")
    private List<T> data;

    @Schema(description = "分页元信息")
    private Meta meta;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meta implements Serializable {
        @Schema(description = "当前页（从1开始）")
        private int page;
        @Schema(description = "每页数量")
        private int size;
        @Schema(description = "总条数")
        private long totalElements;
        @Schema(description = "总页数")
        private int totalPages;
        @Schema(description = "是否第一页")
        private boolean first;
        @Schema(description = "是否最后一页")
        private boolean last;
    }

    public static <T> PageResponse<T> from(Page<T> p) {
        Meta m = new Meta(
                p.getNumber() + 1, // Spring Page 从0开始，这里转成 1 开始
                p.getSize(),
                p.getTotalElements(),
                p.getTotalPages(),
                p.isFirst(),
                p.isLast()
        );
        return new PageResponse<>(p.getContent(), m);
    }
}
