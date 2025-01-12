package com.julytus.search.services.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.julytus.search.repositories.HttpClient.ProfileClient;
import com.julytus.search.utils.SecurityUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.SearchPage;
import org.springframework.stereotype.Service;

import com.julytus.search.models.PostDocument;
import com.julytus.search.models.response.PageResponse;
import com.julytus.search.repositories.PostSearchRepository;
import com.julytus.search.services.PostProfileService;
import com.julytus.search.query.PostQueryBuilder;
import com.julytus.search.constant.PrivacyLevel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostProfileServiceImp implements PostProfileService {

    private final ProfileClient profileClient;
    private final PostSearchRepository postSearchRepository;
    private final PostQueryBuilder queryBuilder;
    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public PageResponse<PostDocument> findByUserId(String targetUserId, int page, int size) {
        String userId = SecurityUtil.getCurrentUserId();

        if(Objects.equals(userId, targetUserId)) {
            return findAllByUserId(targetUserId, page, size);
        }
        List<String> privacyLevels = new ArrayList<>();
        privacyLevels.add(PrivacyLevel.PUBLIC);
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        if(userId == null) {
            NativeQuery query = queryBuilder.buildUserPostsQuery(targetUserId, privacyLevels, pageable);
            SearchHits<PostDocument> searchHits = elasticsearchOperations.search(query, PostDocument.class);

            return buildPageResponse(searchHits, page, size);
        } else {
            if (areFriends(userId, targetUserId)) privacyLevels.add(PrivacyLevel.FRIENDS);
            NativeQuery query = queryBuilder.buildUserPostsQuery(targetUserId, privacyLevels, pageable);
            SearchHits<PostDocument> searchHits = elasticsearchOperations.search(query, PostDocument.class);

            return buildPageResponse(searchHits, page, size);
        }
    }

    private Boolean areFriends(String userId, String targetUserId) {
        return profileClient.checkFriend(userId, targetUserId);
    }

    private PageResponse<PostDocument> findAllByUserId(String userId, int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postSearchRepository.findAllByUserId(userId, pageable);

        return PageResponse.<PostDocument>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }

    private PageResponse<PostDocument> buildPageResponse(SearchHits<PostDocument> searchHits,
                                                         int page, int size) {
        SearchPage<PostDocument> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                PageRequest.of(page - 1, size)
        );

        List<PostDocument> posts = searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());

        return PageResponse.<PostDocument>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(searchPage.getTotalPages())
                .totalElements(searchPage.getTotalElements())
                .data(posts)
                .build();
    }
} 