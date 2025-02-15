package com.julytus.PostService.controllers;

import com.julytus.PostService.exceptions.DataNotFoundException;
import com.julytus.PostService.models.dto.request.LikeRequest;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.models.entity.Like;
import com.julytus.PostService.services.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/like-comment")
@RequiredArgsConstructor
public class LikeCommentController {
    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<Void> likeComment(@PathVariable LikeRequest request) throws DataNotFoundException {
        likeService.likeComment(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> unlikeComment(@PathVariable String commentId) throws DataNotFoundException {
        likeService.unlikeComment(commentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<PageResponse<Like>> getCommentLikers(
            @PathVariable String commentId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) 
            throws DataNotFoundException {
        return ResponseEntity.ok(likeService.getCommentLikers(commentId, page, size));
    }
} 