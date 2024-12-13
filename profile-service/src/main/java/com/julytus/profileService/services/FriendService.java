package com.julytus.profileService.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import com.julytus.event.dto.NotificationEvent;
import com.julytus.event.dto.NotificationType;
import com.julytus.profileService.models.dto.response.PageResponse;
import com.julytus.profileService.repositories.HttpClient.NotificationClient;
import com.julytus.profileService.utils.SecurityUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.julytus.profileService.constants.FriendRequestStatus;
import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.FriendRequest;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.repositories.FriendRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRequestRepository friendRequestRepository;
    private final ProfileService profileService;
    private final NotificationClient notificationClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public boolean checkExistsFriendRelationship(String userId, String friendId) {
        return friendRequestRepository.existsFriendRelationship(userId, friendId);
    }

    @Transactional
    public FriendRequest sendFriendRequest(String receiverId) throws DataNotFoundException {
        String senderId = SecurityUtil.getCurrentUserId();
        if (checkExistsFriendRelationship(senderId, receiverId)) {
            throw new RuntimeException("Users are already friends");
        }

        if (friendRequestRepository.findBySenderAndReceiver(senderId, receiverId).isPresent()) {
            throw new RuntimeException("Friend request already exists");
        }

        UserProfile sender = profileService.getProfileById(senderId);
        UserProfile receiver = profileService.getProfileById(receiverId);

        FriendRequest friendRequest = FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .sentAt(LocalDateTime.now())
                .build();
        FriendRequest request = friendRequestRepository.save(friendRequest);

        NotificationEvent newNotification = NotificationEvent
                .builder()
                .id(request.getId())
                .referenceId(request.getId())
                .senderId(senderId)
                .senderName(sender.getFirstName()
                        + " " + sender.getLastName())
                .receiverId(receiverId)
                .receiverName(receiver.getFirstName()
                        + " " + receiver.getLastName())
                .type(NotificationType.FRIEND_REQUEST)
                .content(senderId + "send Friend request to " + receiverId)
                .createdAt(request.getSentAt())
                .img(sender.getAvatar())
                .build();
        notificationClient.createNotification(newNotification);

        kafkaTemplate.send("notifications", newNotification);

        return request;
    }

    public FriendRequest checkFriendRequestExists(String friendId) {
        String userId = SecurityUtil.getCurrentUserId();
        FriendRequest friendRequest = friendRequestRepository.findBySenderAndReceiver(userId, friendId)
                .orElse(null);
        if (friendRequest == null) {
            return null;
        }
        return friendRequestRepository.findById(friendRequest.getId())
                .orElse(null);
    }

    @Transactional
    public Void respondToFriendRequest(String requestId, FriendRequestStatus status) throws DataNotFoundException {
        String userId = SecurityUtil.getCurrentUserId();

        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        if(!Objects.equals(friendRequest.getReceiver().getId(), userId)) {
            throw new DataNotFoundException("Friend request not found");
        }

        if (status == FriendRequestStatus.DECLINED) {
            friendRequestRepository.deleteById(requestId);
            notificationClient.deleteNotification(requestId);
            return null;
        }

        UserProfile sender = profileService.getProfileById(friendRequest.getSender().getId());
        UserProfile receiver = profileService.getProfileById(friendRequest.getReceiver().getId());

        NotificationEvent newNotification = NotificationEvent
                .builder()
                .senderId(receiver.getId())
                .senderName(receiver.getFirstName()
                        + " " + receiver.getLastName())
                .receiverId(sender.getId())
                .receiverName(sender.getFirstName()
                        + " " + sender.getLastName())
                .createdAt(LocalDateTime.now())
                .img(receiver.getAvatar())
                .referenceId(requestId)
                .build();

        if (status == FriendRequestStatus.ACCEPTED) {
            // Tạo mối quan hệ bạn bè
            friendRequestRepository.createFriendRelationship(
                friendRequest.getSender().getId(),
                friendRequest.getReceiver().getId()
            );

            newNotification.setContent(
                    friendRequest.getSender().getId() + " accepted friend request from "
                            + friendRequest.getReceiver().getId());
            newNotification.setType(NotificationType.REQUEST_ACCEPTED);
            kafkaTemplate.send("friend-notifications", newNotification);
            notificationClient.updateRequestAccepted(requestId);

            friendRequestRepository.deleteById(requestId);
        }
        kafkaTemplate.send("notifications", newNotification);
        return null;
    }

    public List<UserProfileResponse> getFriendList(String userId) {
        return friendRequestRepository.getMyFriends(userId);
    }

    public PageResponse<FriendRequest> getPendingRequests(int page, int size) {
        String userId = SecurityUtil.getCurrentUserId();
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = friendRequestRepository.findPendingRequest(userId, pageable);

        return PageResponse.<FriendRequest>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }

    public void cancelRequest(String requestId) {
         friendRequestRepository.deleteById(requestId);
         notificationClient.deleteNotification(requestId);
    }

    @Transactional
    public void unfriend(String friendId) {
      String userId = SecurityUtil.getCurrentUserId();
        if (!checkExistsFriendRelationship(userId, friendId)) {
            throw new RuntimeException("Users are not friends");
        }

        friendRequestRepository.deleteFriendRelationship(userId, friendId);
    }
} 