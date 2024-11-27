package com.julytus.PostService.repositories;

import com.julytus.PostService.models.entity.PostImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends MongoRepository<PostImage, String> {

    @Query(value = "{ 'postId': ?0 }", fields = "{ 'url' : 1 }")
    List<String> findPostImageByPostId(String postId);
}
