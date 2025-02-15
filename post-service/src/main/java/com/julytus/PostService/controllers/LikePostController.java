package com.julytus.PostService.controllers;

import com.julytus.PostService.models.dto.request.LikeRequest;
import com.julytus.PostService.models.entity.Like;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.julytus.PostService.exceptions.DataNotFoundException;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.services.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/like-post")
@RequiredArgsConstructor
public class LikePostController {
    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<Void> likePost(@RequestBody LikeRequest request) throws DataNotFoundException {
        likeService.likePost(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unlikePost(@PathVariable String postId) throws DataNotFoundException {
        likeService.unlikePost(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PageResponse<Like>> getPostLikers(
            @PathVariable String postId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) 
            throws DataNotFoundException {
        return ResponseEntity.ok(likeService.getPostLikers(postId, page, size));
    }
} 