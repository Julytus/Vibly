package com.julytus.ChatService.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.julytus.ChatService.models.dto.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {


    private final ObjectMapper mapper;

    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        ResponseObject responseObject = new ResponseObject();
        responseObject.setStatus(HttpStatus.UNAUTHORIZED);

        String errorMessage = Optional.ofNullable(authException.getCause()) // NULL
                .map(Throwable::getMessage)
                .orElse(authException.getMessage());
        responseObject.setData(errorMessage);

        responseObject.setMessage("Token is invalid (expired, incorrect format, or not passing JWT in header)...");

        mapper.writeValue(response.getWriter(), responseObject);
    }
}
