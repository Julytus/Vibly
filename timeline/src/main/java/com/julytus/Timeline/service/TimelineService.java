package com.julytus.Timeline.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.julytus.Timeline.dto.PostResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimelineService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String TIMELINE_KEY_PREFIX = "timeline:";

    public List<PostResponse> getUserTimeline(String userId, int page, int size) {
        String timelineKey = TIMELINE_KEY_PREFIX + userId;
        return Objects.requireNonNull(redisTemplate.opsForList()
                        .range(timelineKey, (long) page * size, ((long) page * size + size - 1)))
                .stream()
                .map(this::convertToPostResponse)
                .toList();
    }
    
    @SuppressWarnings("unchecked")
    private PostResponse convertToPostResponse(Object post) {
        Map<String, Object> postMap = (Map<String, Object>) post;
        Object imageUrlsObj = postMap.get("imageUrls");

        return new PostResponse(
            postMap.get("id").toString(),
            postMap.get("userId").toString(),
            postMap.get("content").toString(),
            imageUrlsObj instanceof List<?> urls && urls.size() > 1 && urls.get(1) instanceof List
                ? (List<String>) urls.get(1)
                : List.of(),
            LocalDateTime.parse(postMap.get("createdAt").toString())
        );
    }
}
