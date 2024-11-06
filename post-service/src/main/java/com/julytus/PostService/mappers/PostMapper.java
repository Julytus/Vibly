package com.julytus.PostService.mappers;

import com.julytus.PostService.models.dto.request.PostCreationRequest;
import com.julytus.PostService.models.dto.response.PostResponse;
import com.julytus.PostService.models.entity.Post;
//import org.mapstruct.Builder;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;

//@Mapper(builder = @Builder(disableBuilder = true))
public class PostMapper {

//    PostMapper INSTANCE = Mappers.getMapper(PostMapper.class);

//    @Mapping(target = "id", ignore = true)
public static Post toPost(PostCreationRequest dto) {
        return Post.builder()
                .content(dto.getContent())
                .userId(dto.getUserId())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
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
