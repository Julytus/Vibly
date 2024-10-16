package com.julytus.IdentityService.models.dto.request;

import jakarta.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank(message = "username is required!")
    @JsonProperty("username")
    String username;

    @NotBlank(message = "email is required!")
    @JsonProperty("email")
    String email;

    @NotBlank(message = "Password cannot be blank!")
    @JsonProperty("password")
    String password;

    @JsonProperty("first_name")
    String firstName;
    @JsonProperty("last_name")
    String lastName;

    @NotBlank(message = "Retype password cannot be blank!")
    @JsonProperty("retype_password")
    String retypePassword;
}
