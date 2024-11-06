package com.julytus.PostService.controllers;

import com.julytus.PostService.models.dto.request.PostCreationRequest;
import com.julytus.PostService.models.dto.response.PageResponse;
import com.julytus.PostService.models.dto.response.PostResponse;
import com.julytus.PostService.models.entity.Post;
import com.julytus.PostService.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/u")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping()
    public ResponseEntity<Post> createPost(
            @RequestBody PostCreationRequest request) {

        Post response = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/upload/{id}")
    public ResponseEntity<Post> uploadPostImg(
            @RequestBody List<MultipartFile> files,
            @PathVariable String id
    ) throws IOException {

        return ResponseEntity.status(HttpStatus.CREATED).body(postService.upImage(id, files));
    }

    @GetMapping("/img/{url}")
    public ResponseEntity<?> getImgPostByUrl(@PathVariable String url) {
        try {
            java.nio.file.Path imagePath = Paths.get("uploads/post/" + url);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.      get("uploads/image-not-found.jpg").toUri()));
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    ResponseEntity<PageResponse<PostResponse>> getAllPosts(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ){
        return ResponseEntity.ok(postService.getAll(page, size));
    }

    @GetMapping("/{userId}")
    ResponseEntity<PageResponse<PostResponse>> getPostsByUserId(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @PathVariable String userId
    ){
        return ResponseEntity.ok(postService.getPostByUserId(page, size, userId));
    }
}
