package com.julytus.search.query;

import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PostQueryBuilder {
    
    public NativeQuery buildUserPostsQuery(String userId, List<String> privacyLevels, Pageable pageable) {
        return NativeQuery.builder()
                .withQuery(q -> q
                    .bool(b -> b
                        .must(m -> m
                            .match(t -> t
                                .field("userId")
                                .query(userId)
                            )
                        )
                        .must(m -> m
                            .bool(innerBool -> {
                                privacyLevels.forEach(level -> 
                                    innerBool.should(s -> s
                                        .match(n -> n
                                            .field("privacyLevel")
                                            .query(level)
                                        )
                                    )
                                );
                                return innerBool.minimumShouldMatch("1");
                            })
                        )
                    )
                )
                .withPageable(pageable)
                .build();
    }
} 