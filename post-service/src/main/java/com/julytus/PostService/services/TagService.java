package com.julytus.PostService.services;

import com.julytus.PostService.models.entity.Tag;
import com.julytus.PostService.repositories.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public List<Tag> getOrCreateTags(String content) {
        List<String> hashtags = extractHashtags(content);
        List<Tag> tags = new ArrayList<>();
        
        for (String hashtag : hashtags) {
            String name = hashtag.substring(1);
            Tag tag = tagRepository.findByHashtag(hashtag)
                    .orElseGet(() -> createTag(name, hashtag));
            tags.add(tag);
        }
        
        return tags;
    }

    private Tag createTag(String name, String hashtag) {
        Tag tag = Tag.builder()
                .name(name)
                .hashtag(hashtag)
                .build();
        return tagRepository.save(tag);
    }

    private List<String> extractHashtags(String content) {
        List<String> hashtags = new ArrayList<>();
        Pattern pattern = Pattern.compile("#\\w+");
        Matcher matcher = pattern.matcher(content);
        
        while (matcher.find()) {
            hashtags.add(matcher.group());
        }
        
        return hashtags;
    }

    public Tag findByHashtag(String searchTerm) {
        String hashtag = searchTerm.startsWith("#") ? searchTerm : "#" + searchTerm;
        return tagRepository.findByHashtag(hashtag).orElse(null);
    }
} 