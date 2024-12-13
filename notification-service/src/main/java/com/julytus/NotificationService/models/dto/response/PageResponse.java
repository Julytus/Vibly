package com.julytus.NotificationService.models.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> {
    @JsonProperty("current_page")
    int currentPage;
    @JsonProperty("total_pages")
    int totalPages;
    @JsonProperty("page_size")
    int pageSize;
    @JsonProperty("total_elements")
    long totalElements;

    @Builder.Default
    private List<T> data = Collections.emptyList();
}