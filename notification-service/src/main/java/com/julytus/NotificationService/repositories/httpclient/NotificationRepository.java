package com.julytus.NotificationService.repositories.httpclient;

import com.julytus.NotificationService.models.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    Page<Notification> findAllByReceiverId(String receiverId, Pageable pageable);
}
