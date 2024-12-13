package com.julytus.profileService.models.entity;

import com.julytus.profileService.constants.FriendRequestStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDateTime;

@Node
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendRequest {

    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String id;

    @Relationship(type = "REQUESTED_BY", direction = Relationship.Direction.OUTGOING)
    UserProfile sender;

    @Relationship(type = "REQUESTED_TO", direction = Relationship.Direction.INCOMING)
    UserProfile receiver;

    LocalDateTime sentAt;
    LocalDateTime respondedAt;

    FriendRequestStatus status;
}
