package com.julytus.search.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.julytus.search.models.PostDocument;

public interface PostSearchRepository extends ElasticsearchRepository<PostDocument, String> {

    @Query("""
        {
            "bool": {
                "must": [
                    {
                        "match": {
                            "content": "?0"
                        }
                    }
                ]
            }
        }
    """)
    Page<PostDocument> searchByContent(String content, Pageable pageable);

    // Tìm theo tag name
    @Query("""
        {
            "bool": {
                "must": [
                    {
                        "nested": {
                            "path": "tags",
                            "query": {
                                "match": {
                                    "tags.name": "?0"
                                }
                            }
                        }
                    }
                ]
            }
        }
    """)
    Page<PostDocument> findByTagName(String tagName, Pageable pageable);

    // Tìm theo nội dung và userId
    @Query("""
        {
            "bool": {
                "must": [
                    {
                        "match": {
                            "content": "?0"
                        }
                    },
                    {
                        "term": {
                            "userId": "?1"
                        }
                    }
                ]
            }
        }
    """)
    Page<PostDocument> searchByContentAndUserId(String content, String userId, Pageable pageable);

    // Tìm theo khoảng thời gian
    @Query("""
        {
            "bool": {
                "must": [
                    {
                        "range": {
                            "createdAt": {
                                "gte": "?0",
                                "lte": "?1"
                            }
                        }
                    }
                ]
            }
        }
    """)
    Page<PostDocument> findByCreatedAtBetween(String startDate, String endDate, Pageable pageable);

    Page<PostDocument> findAllByUserId(String userId, Pageable pageable);
} 