package com.julytus.NotificationService.models.dto.request;

import java.util.List;

import com.julytus.NotificationService.models.Recipient;
import com.julytus.NotificationService.models.Sender;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailRequest {
    Sender sender;
    List<Recipient> to;
    String subject;
    String htmlContent;
}
