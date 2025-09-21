package com.example.tasks.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;
import java.util.List;

@Getter @Setter
public class PageResponse<T> {
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

    @Setter @Getter
    public static class Meta {
        private int page;
        private int size;
        private int totalPages;
        private long totalItems;
        private boolean hasNext;
        private boolean hasPrev;
        private String sort;
    }
}
