package com.julytus.search.services;

import com.julytus.search.models.PostDocument;
import com.julytus.search.models.response.PageResponse;

public interface PostProfileService {
    PageResponse<PostDocument> findByUserId(String userId, int page, int size);
}