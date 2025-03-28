package com.julytus.event.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendEmailEvent {
    String channel;
    String recipient;
    String recipientName;
    String templateCode;
    Map<String, Object> param;
    String subject;
    String body;
}
