package com.julytus.PostService.models.dto.request;

import com.julytus.PostService.constants.PrivacyLevel;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreationRequest {
    String content;
    @Builder.Default
    PrivacyLevel privacyLevel = PrivacyLevel.PUBLIC;
}
