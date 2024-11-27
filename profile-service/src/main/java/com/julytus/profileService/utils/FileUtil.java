package com.julytus.profileService.utils;

import com.julytus.profileService.models.entity.UserProfile;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
    //Update Image(Avatar or Background)
    public static String updateImage(UserProfile userProfile,
                                   MultipartFile file,
                                   String uploadsFolder) throws IOException {
        validateImageFile(file);

        String fileName = userProfile.getId() + "_" + UUID.randomUUID() + "_" + StringUtils.cleanPath(
                Objects.requireNonNull(file.getOriginalFilename()));
        java.nio.file.Path uploadDir = java.nio.file.Paths.get(uploadsFolder);

        if (!Files.exists(uploadDir)) {
            Files.createDirectory(uploadDir);
        }

        java.nio.file.Path destination = Paths.get(uploadDir.toString(), fileName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        }
        return fileName;
    }

}
