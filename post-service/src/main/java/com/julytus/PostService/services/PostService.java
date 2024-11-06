package com.julytus.PostService.services;

import com.julytus.PostService.utils.FileUtil;
import com.julytus.event.dto.BasicProfile;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.julytus.PostService.mappers.PostMapper;
import com.julytus.PostService.models.dto.request.PostCreationRequest;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.models.dto.response.PostResponse;
import com.julytus.PostService.models.entity.Post;
import com.julytus.PostService.repositories.PostRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final BasicProfileInfo basicProfileInfo;

    public Post createPost(PostCreationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        BasicProfile basicProfile = basicProfileInfo.getBasicProfileByUsername(username);

        request.setUserId(basicProfile.getId());
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());

        Post post = PostMapper.toPost(request);
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

    public PageResponse<PostResponse> getPostByUserId(int page, int size, String userId){
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var pageData = postRepository.findAllByUserId(userId, pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(PostMapper::toPostResponse).toList())
                .build();
    }
}
