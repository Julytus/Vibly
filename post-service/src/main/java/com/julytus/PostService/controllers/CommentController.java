package com.julytus.PostService.controllers;

import com.julytus.PostService.exceptions.DataNotFoundException;
import com.julytus.PostService.models.dto.request.CommentRequest;
import com.julytus.PostService.models.dto.response.CommentResponse;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.services.CommentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @GetMapping("/post-comment/{postId}")
    ResponseEntity<PageResponse<CommentResponse>> findAll(
            @PathVariable String postId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "3") int size) {

        return ResponseEntity.ok((commentService.getCommentByPostId(postId, page, size)));
    }

    @PostMapping("/add-comment")
    ResponseEntity<CommentResponse> addComment (@RequestBody @Valid CommentRequest request)
            throws DataNotFoundException {
        return ResponseEntity.ok(commentService.addComment(request));
    }

    @DeleteMapping("/delete-comment/{commentId}")
    ResponseEntity<String> deleteComment (@PathVariable String commentId) throws Exception {
        commentService.deleteComment(commentId);

        return ResponseEntity.ok("Delete Comment Successfully");
    }
}
