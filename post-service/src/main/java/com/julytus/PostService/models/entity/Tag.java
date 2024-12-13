package com.julytus.PostService.models.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Getter
@Setter
@Builder
@Document(value = "tag")
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Tag {
    @MongoId
    String id;
    String name;     // Tên tag không có dấu #, ví dụ: "java"
    String hashtag;  // Tag với dấu #, ví dụ: "#java"
}