package com.julytus.NotificationService.mappers;

import com.julytus.NotificationService.models.models.Notification;
import com.julytus.event.dto.NotificationEvent;

public class NotificationMapper {
    public static Notification fromNotificationEvent(NotificationEvent message) {
        return Notification
                .builder()
                .type(message.getType())
                .img(message.getImg())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .receiverId(message.getReceiverId())
                .receiverName(message.getReceiverName())
                .referenceId(message.getReferenceId())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
