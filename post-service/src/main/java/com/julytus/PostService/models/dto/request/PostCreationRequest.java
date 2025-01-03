package com.julytus.PostService.models.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.julytus.PostService.constants.PrivacyLevel;

import lombok.Data;

@Data
public class PostCreationRequest {
    private String content;
    private PrivacyLevel privacyLevel;
    private List<MultipartFile> images;
}
