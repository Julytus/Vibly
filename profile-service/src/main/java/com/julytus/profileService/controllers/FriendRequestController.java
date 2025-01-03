package com.julytus.profileService.controllers;

import com.julytus.profileService.constants.FriendRequestStatus;
import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.response.PageResponse;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.FriendRequest;
import com.julytus.profileService.services.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendRequestController {
    private final FriendService friendService;

    @PostMapping("/send")
    public ResponseEntity<FriendRequest> createFriendRequest(
            @RequestParam String receiverId
    ) throws DataNotFoundException {
        FriendRequest friendRequest = friendService.sendFriendRequest(receiverId);
        return ResponseEntity.ok(friendRequest);
    }

    @GetMapping("/checkRequest")
    public ResponseEntity<FriendRequest> checkRequest(
            @RequestParam String friendId
    ) {
        return ResponseEntity.ok(friendService.checkFriendRequestExists(friendId));
    }

    @GetMapping("/checkFriend")
    public ResponseEntity<Boolean> checkFriend(
        @RequestParam String friendId,
        @RequestParam String userId
    ) {
        return ResponseEntity.ok(friendService.checkExistsFriendRelationship(userId, friendId));
    }

    @DeleteMapping("/cancel")
    public ResponseEntity<Void> cancelFriendRequest(
            @RequestParam String requestId
    ) {
        friendService.cancelRequest(requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<Void> acceptFriendRequest(
            @RequestParam String requestId
    ) throws DataNotFoundException {

        Void friendRequest = friendService
                .respondToFriendRequest(requestId, FriendRequestStatus.ACCEPTED);
        return ResponseEntity.ok(friendRequest);
    }

    @PostMapping("/decline")
    public ResponseEntity<Void> declineFriendRequest(
            @RequestParam String requestId
    ) throws DataNotFoundException {

        Void friendRequest = friendService
                .respondToFriendRequest(requestId, FriendRequestStatus.DECLINED);
        return ResponseEntity.ok(friendRequest);
    }

    @GetMapping("/pending")
    public ResponseEntity<PageResponse<FriendRequest>> getPendingFriendRequests(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        PageResponse<FriendRequest> requestList = friendService.getPendingRequests(page, size);
        return ResponseEntity.ok(requestList);
    }

    @GetMapping()
    public ResponseEntity<List<UserProfileResponse>> getMyFriend(
            @RequestParam String userId
    ) {
        List<UserProfileResponse> listFriend = friendService.getFriendList(userId);
        return ResponseEntity.ok(listFriend);
    }

    @PostMapping("/unfriend")
    public ResponseEntity<Void> unfriendRequest(
            @RequestParam String friendId
    ) {
        friendService.unfriend(friendId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/listId")
    public ResponseEntity<List<String>> getAllFollower(
            @RequestParam String userId
    ) {
        List<String> followers = friendService.findFriendsAndRequesters(userId);
        return ResponseEntity.ok(followers);
    }
}
