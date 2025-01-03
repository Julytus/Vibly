package com.julytus.PostProcessor.consumers;

import com.julytus.PostProcessor.clients.ProfileClient;
import com.julytus.event.dto.PostEvent;
import com.julytus.PostProcessor.services.TimelineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostEventConsumer {
    private final ProfileClient profileClient;
    private final TimelineService timelineService;

    @KafkaListener(topics = "${spring.kafka.topics.new-post}")
    public void handleNewPost(PostEvent postEvent) {
        try {
            log.info("Received new post event: {}", postEvent);

            var followerIds = profileClient.getFollowerIds(postEvent.getUserId());
            
            // Thêm bài post vào timeline của các follower
            timelineService.addPostToTimelines(postEvent, followerIds);
            
            log.info("Successfully processed post {} for {} followers", 
                    postEvent.getId(), followerIds.size());
        } catch (Exception e) {
            log.error("Error processing post event: {}", e.getMessage(), e);
        }
    }
} 