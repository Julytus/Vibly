package com.julytus.PostService.services;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.julytus.PostService.exceptions.DataNotFoundException;
import com.julytus.event.dto.PostEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

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

import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final TagService tagService;
    private final ProfileClient profileClient;
    private final FileUtil fileUtil;
    private final KafkaTemplate<String, PostEvent> kafkaTemplate;

    @Value("${spring.kafka.topics.new-post}")
    private String newPostTopic;

    @PreAuthorize("isAuthenticated()")
    public Post createPost(PostCreationRequest request) throws IOException, ServerException, 
            InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, 
            InvalidKeyException, XmlParserException, InvalidResponseException, InternalException {
        String userId = SecurityUtil.getCurrentUserId();
        List<Tag> tags = tagService.getOrCreateTags(request.getContent());
        
        List<String> imageUrls = new ArrayList<>();
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            imageUrls = fileUtil.uploadFile(request.getImages());
        }

        Post post = Post.builder()
                .userId(userId)
                .content(request.getContent())
                .tags(tags)
                .imageUrls(imageUrls)
                .privacyLevel(request.getPrivacyLevel())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Post savedPost = postRepository.save(post);
        sendMess(post);
        return savedPost;
    }

    public PageResponse<PostResponse> getAllPostByUserId(int page, int size, String targetUserId) {
        String userId = SecurityUtil.getCurrentUserId();
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        boolean isFriend = false;
        boolean isSelfProfile = false;
        if (userId != null) isSelfProfile = userId.equals(targetUserId);

        if (!isSelfProfile && userId != null) isFriend = areFriends(userId, targetUserId);

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

    @PreAuthorize("isAuthenticated()")
    public void deletePostById(String postId) throws Exception {
        String userId = SecurityUtil.getCurrentUserId();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataNotFoundException("POST_NOT_EXISTED"));

        if (Objects.equals(userId, post.getUserId())) {
            postRepository.delete(post);
            return;
        }

        throw new Exception("DELETE_COMMENT_INVALID");
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

    private Boolean areFriends(String userId, String targetUserId) {
        return profileClient.checkFriend(userId, targetUserId);
    }

    private void sendMess(Post post) {
        PostEvent postEvent = PostEvent
                .builder()
                .id(post.getId())
                .userId(post.getUserId())
                .content(post.getContent())
                .imageUrls(post.getImageUrls())
                .createdAt(post.getCreatedAt())
                .build();
        kafkaTemplate.send(newPostTopic, postEvent);
    }
}