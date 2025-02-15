package com.julytus.PostService.models.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class LikeRequest {
    @JsonProperty("post_id")
    String postId;
    @JsonProperty("comment_id")
    String commentId;
    @JsonProperty("first_name")
    String firstName;
    @JsonProperty("last_name")
    String lastName;
    String avatar;
}
