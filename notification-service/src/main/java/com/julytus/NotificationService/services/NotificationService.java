package com.julytus.NotificationService.services;

import com.julytus.NotificationService.exceptions.DataNotFoundException;
import com.julytus.NotificationService.mappers.NotificationMapper;
import com.julytus.NotificationService.models.dto.response.PageResponse;
import com.julytus.NotificationService.models.models.Notification;
import com.julytus.NotificationService.repositories.httpclient.NotificationRepository;
import com.julytus.NotificationService.utils.SecurityUtil;
import com.julytus.event.dto.NotificationEvent;
import com.julytus.event.dto.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public PageResponse<Notification> getMyNotifications(int page, int size) {
        String userId = SecurityUtil.getCurrentUserId();

        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var pageData = notificationRepository.findAllByReceiverId(userId, pageable);

        return PageResponse.<Notification>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }

    public Notification createNotification(NotificationEvent message) {
        if (message.getType() == NotificationType.FRIEND_REQUEST) {
            Notification notification = NotificationMapper.fromNotificationEvent(message);
            notification.setId(message.getId());
            return notificationRepository.save(notification);
        }

        return null;
    }

    public Notification getNotification(String id) throws DataNotFoundException {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Not found notification with id: " + id));
    }

    public Notification updateRequestAccepted(String id) throws DataNotFoundException {
        Notification notification = getNotification(id);
        String receiverId = notification.getReceiverId();
        String receiverName = notification.getReceiverName();
        String senderId = notification.getSenderId();
        String senderName = notification.getSenderName();
        notification.setReceiverId(senderId);
        notification.setReceiverName(senderName);
        notification.setSenderId(receiverId);
        notification.setSenderName(receiverName);
        notification.setType(NotificationType.REQUEST_ACCEPTED);
        return notificationRepository.save(notification);
    }

    public Notification DeleteNotification(String id) throws DataNotFoundException {
        Notification notification = getNotification(id);
        notification.setType(NotificationType.REQUEST_DECLINED);
        notificationRepository.deleteById(id);
        return notification;
    }
}
