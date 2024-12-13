package com.julytus.PostService.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.julytus.PostService.constants.PrivacyLevel;
import com.julytus.PostService.mappers.PostMapper;
import com.julytus.PostService.models.dto.request.PostCreationRequest;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.models.dto.response.PostResponse;
import com.julytus.PostService.models.entity.Post;
import com.julytus.PostService.models.entity.Tag;
import com.julytus.PostService.repositories.HttpClient.ProfileClient;
import com.julytus.PostService.repositories.PostRepository;
import com.julytus.PostService.utils.FileUtil;
import com.julytus.PostService.utils.SecurityUtil;
import com.julytus.PostService.utils.UserLoginInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final TagService tagService;
    private final ProfileClient profileClient;

    public Post createPost(PostCreationRequest request) {
        String userId = SecurityUtil.getCurrentUserId();

        List<Tag> tags = tagService.getOrCreateTags(request.getContent());

        Post post = Post.builder()
                .userId(userId)
                .content(request.getContent())
                .tags(tags)
                .privacyLevel(request.getPrivacyLevel())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return postRepository.save(post);
    }

    public Post upImage(String id, List<MultipartFile> images) throws IOException {
        Post post = postRepository.findById(id).orElse(null);

        String uploadsFolder = "uploads/post";
        Objects.requireNonNull(post).setImageUrls(FileUtil.upImages(post, images, uploadsFolder));
        return postRepository.save(post);
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PageResponse<PostResponse> getAll(int page, int size){
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var pageData = postRepository.findAll(pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(PostMapper::toPostResponse).toList())
                .build();
    }

    public PageResponse<PostResponse> getPostByUserId(int page, int size, String targetUserId) {
         String userId = SecurityUtil.getCurrentUserId();
         Sort sort = Sort.by("createdAt").descending();
         Pageable pageable = PageRequest.of(page - 1, size, sort);

         boolean isFriend = false;
         boolean isSelfProfile = userId.equals(targetUserId);

         if (!isSelfProfile) {
            isFriend = areFriends(userId, targetUserId);
         }
        
         var pageData = postRepository.findByUserIdAndPrivacyLevelIn(
             targetUserId, 
             getAccessiblePrivacyLevels(isSelfProfile, isFriend),
             pageable
         );

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(PostMapper::toPostResponse).toList())
                .build();
    }

    private List<PrivacyLevel> getAccessiblePrivacyLevels(boolean isSelfProfile, boolean isFriend) {
        List<PrivacyLevel> accessibleLevels = new ArrayList<>();
        
        accessibleLevels.add(PrivacyLevel.PUBLIC);
        
        if (isFriend) {
            accessibleLevels.add(PrivacyLevel.FRIENDS);
        }
        
        if (isSelfProfile) {
            accessibleLevels.add(PrivacyLevel.FRIENDS);
            accessibleLevels.add(PrivacyLevel.PRIVATE);
        }
        
        return accessibleLevels;
    }

    public PageResponse<PostResponse> getPostsByHashtag(String hashtag, int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        
        String searchHashtag = hashtag.startsWith("#") ? hashtag : "#" + hashtag;
        var pageData = postRepository.findByTagsHashtag(searchHashtag, pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(PostMapper::toPostResponse).toList())
                .build();
    }

    private Boolean areFriends(String userId, String targetUserId) {
        return profileClient.checkFriend(userId, targetUserId);
    }
}
