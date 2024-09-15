package com.julytus.Apigateway.services;

import com.julytus.Apigateway.models.dto.request.IntrospectRequest;
import com.julytus.Apigateway.models.dto.response.IntrospectResponse;
import com.julytus.Apigateway.repositories.IdentityClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@Service
public class IdentityService {
    private final IdentityClient identityClient;

    public Mono<ResponseEntity<IntrospectResponse>> introspect(String token) {
        return identityClient.introspect(IntrospectRequest.builder()
                .token(token)
                .build());
    }
}