package com.julytus.search.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;
import java.util.List;

@Document(indexName = "post")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDocument {
    @Id
    private String id;
    
    @Field(type = FieldType.Text)
    private String userId;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String content;
    
    @Field(type = FieldType.Keyword)
    @JsonProperty("image_urls")
    private List<String> imageUrls;
    
    @Field(type = FieldType.Nested)
    private List<TagDocument> tags;
    
    @Field(type = FieldType.Keyword)
    private String privacyLevel;
    
    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
} 