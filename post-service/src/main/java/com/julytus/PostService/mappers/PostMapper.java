package com.julytus.PostService.mappers;

import com.julytus.PostService.models.dto.request.PostCreationRequest;
import com.julytus.PostService.models.dto.response.PostResponse;
import com.julytus.PostService.models.entity.Post;
public class PostMapper {

public static Post toPost(PostCreationRequest dto) {
        return Post.builder()
                .content(dto.getContent())
                .build();
    };
    public static PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .userId(post.getUserId())
                .imageUrls(post.getImageUrls())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    };
}
