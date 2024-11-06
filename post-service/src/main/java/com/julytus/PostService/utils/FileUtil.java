package com.julytus.PostService.utils;

import com.julytus.PostService.models.entity.Post;
import com.julytus.PostService.repositories.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class FileUtil {

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

    //Up Image
    public static List<String> upImages(Post post,
                                List<MultipartFile> files,
                                String uploadsFolder) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        java.nio.file.Path uploadDir = Paths.get(uploadsFolder);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        for (MultipartFile file : files) {
            validateImageFile(file);

            String fileName = post.getId() + "_" + UUID.randomUUID() + "_" +
                    StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

            java.nio.file.Path destination = uploadDir.resolve(fileName);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }

            imageUrls.add(fileName);
        }
        return imageUrls;
    }


}
