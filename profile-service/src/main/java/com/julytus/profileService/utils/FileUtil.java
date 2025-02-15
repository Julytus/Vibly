package com.julytus.profileService.utils;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FileUtil {
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    //Check ContentType
    public static boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }
    //Check size
    public static void validateImageFile(MultipartFile file) throws IOException {
        if (!isImageFile(file) || file.getOriginalFilename() == null || file.getOriginalFilename() == null) {
            throw new IOException("Invalid image file");
        }
        if (file.isEmpty()) {
            throw new IOException("File is empty or null.");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IOException("Image must be smaller than 5MB");
        }
    }

    @PostConstruct
    public void init() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Update Image(Avatar or Background)
    public String uploadImage(MultipartFile file)
            throws IOException, ServerException, InsufficientDataException,
            ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException,
            InvalidResponseException, XmlParserException, InternalException {
        validateImageFile(file);

        String fileName = UUID.randomUUID() + "_"
                + StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(fileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .bucket(bucket)
                        .object(fileName)
                        .method(Method.GET)
                        .build());
    }

}
