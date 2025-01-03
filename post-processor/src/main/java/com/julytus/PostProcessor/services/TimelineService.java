package com.julytus.PostProcessor.services;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.julytus.event.dto.PostEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimelineService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String TIMELINE_KEY_PREFIX = "timeline:";
    private static final Duration TIMELINE_TTL = Duration.ofDays(3);

    public void addPostToTimelines(PostEvent post, List<String> followerIds) {
        // Chuyển PostEvent thành Map để dễ serialize
        Map<String, Object> postMap = new HashMap<>();
        postMap.put("id", post.getId());
        postMap.put("userId", post.getUserId());
        postMap.put("content", post.getContent());
        postMap.put("imageUrls", post.getImageUrls());
        postMap.put("createdAt", post.getCreatedAt().toString());
        
        for (String followerId : followerIds) {
            String timelineKey = TIMELINE_KEY_PREFIX + followerId;
            redisTemplate.opsForList().leftPush(timelineKey, postMap);
            redisTemplate.expire(timelineKey, TIMELINE_TTL);
        }
    }
} 