package com.julytus.profileService.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.FriendRequest;

@Repository
public interface FriendRequestRepository extends Neo4jRepository<FriendRequest, String> {

    @Query("MATCH (s:UserProfile {id: $senderId})-[:REQUESTED_BY|REQUESTED_TO]-" +
            "(fr:FriendRequest)-[:REQUESTED_BY|REQUESTED_TO]-(r:UserProfile {id: $receiverId}) " +
            "RETURN fr")
    Optional<FriendRequest> findBySenderAndReceiver(@Param("senderId") String senderId, 
                                                  @Param("receiverId") String receiverId);

    @Query(value = "MATCH (fr:FriendRequest)-[:REQUESTED_TO]-(r:UserProfile {id: $receiverId}) " +
           "RETURN fr",
           countQuery = "MATCH (fr:FriendRequest)-[:REQUESTED_TO]-(r:UserProfile {id: $receiverId}) " +
           "RETURN COUNT(fr)")
    Page<FriendRequest> findPendingRequest(@Param("receiverId") String receiverId, Pageable pageable);

    @Query("MATCH (:UserProfile {id: $userId})-[:FRIEND]->(friend:UserProfile) " +
           "RETURN friend.id as id, " +
           "friend.email as email, " +
           "friend.username as username, " +
           "friend.firstName as firstName, " +
           "friend.lastName as lastName, " +
           "friend.avatar as avatar, " +
           "friend.background as background")
    List<UserProfileResponse> getMyFriends(@Param("userId") String userId);
    
    @Query("MATCH (sender:UserProfile {id: $senderId}), (receiver:UserProfile {id: $receiverId}) " +
           "CREATE (sender)-[:FRIEND]->(receiver), (receiver)-[:FRIEND]->(sender)")
    void createFriendRelationship(@Param("senderId") String senderId, @Param("receiverId") String receiverId);

    @Query("MATCH (user:UserProfile {id: $userId})-[r:FRIEND]-(friend:UserProfile {id: $friendId}) " +
           "RETURN COUNT(r) > 0")
    boolean existsFriendRelationship(@Param("userId") String userId, @Param("friendId") String friendId);

    @Query("MATCH (user:UserProfile {id: $userId})-[r:FRIEND]-(friend:UserProfile {id: $friendId}) " +
           "DELETE r")
    void deleteFriendRelationship(@Param("userId") String userId, @Param("friendId") String friendId);

} 