package com.julytus.NotificationService.controllers;

import com.julytus.NotificationService.exceptions.DataNotFoundException;
import com.julytus.NotificationService.models.dto.response.PageResponse;
import com.julytus.NotificationService.models.models.Notification;
import com.julytus.NotificationService.services.NotificationService;
import com.julytus.event.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/request")
    public ResponseEntity<PageResponse<Notification>> getMyNotifications(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        var result = notificationService.getMyNotifications(page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/request")
    public ResponseEntity<Notification> createNotification(
            @RequestBody NotificationEvent message
    ) {
        var result = notificationService.createNotification(message);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/request/{id}")
    public ResponseEntity<Notification> updateRequestAccepted(
            @PathVariable String id
    ) throws DataNotFoundException {
        return ResponseEntity.ok(notificationService.updateRequestAccepted(id));
    }

    @DeleteMapping("/request/{id}")
    public ResponseEntity<Notification> deleteNotification(
            @PathVariable String id
    ) throws DataNotFoundException {
        return ResponseEntity.ok(notificationService.DeleteNotification(id));
    }
}
