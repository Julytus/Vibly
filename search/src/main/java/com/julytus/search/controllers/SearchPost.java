package com.julytus.search.controllers;

import com.julytus.search.models.response.PageResponse;
import org.springframework.web.bind.annotation.*;

import com.julytus.search.models.PostDocument;
import com.julytus.search.services.PostProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/s")
@RequiredArgsConstructor
public class SearchPost {
    private final PostProfileService postProfileService;

    @GetMapping("/posts/user/{userId}")
    public PageResponse<PostDocument> findByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return postProfileService.findByUserId(userId, page, size);
    }

} 