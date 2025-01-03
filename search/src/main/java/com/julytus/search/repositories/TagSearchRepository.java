package com.julytus.search.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import com.julytus.search.models.TagDocument;

public interface TagSearchRepository extends ElasticsearchRepository<TagDocument, String> {
} 