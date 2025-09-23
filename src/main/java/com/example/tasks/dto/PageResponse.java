package com.example.tasks.dto;

import lombok.*;
import org.springframework.data.domain.Page;
import java.util.List;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PageResponse<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<T> data;
    private Meta meta;

    public static <T> PageResponse<T> from(Page<T> page, int pageParam1Based, int size, String sortText) {
        Meta m = new Meta();
        m.setPage(pageParam1Based);
        m.setSize(size);
        m.setTotalPages(page.getTotalPages());
        m.setHasNext(page.hasNext());
        m.setHasPrev(page.hasPrevious());
        m.setSort(sortText);

        PageResponse<T> resp = new PageResponse<>();
        resp.setData(page.getContent());
        resp.setMeta(m);
        return resp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Setter
    @Getter
    public static class Meta implements Serializable {
        private int page;
        private int size;
        private int totalPages;
        private long totalItems;
        private boolean hasNext;
        private boolean hasPrev;
        private String sort;
    }
}
