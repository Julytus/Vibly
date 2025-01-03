package com.julytus.Timeline.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.julytus.Timeline.dto.PostResponse;
import com.julytus.Timeline.service.TimelineService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/timelines")
@RequiredArgsConstructor
public class TimelineController {
    private final TimelineService timelineService;
    
    @GetMapping("/{userId}")
    public List<PostResponse> getUserTimeline(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return timelineService.getUserTimeline(userId, page, size);
    }
}
