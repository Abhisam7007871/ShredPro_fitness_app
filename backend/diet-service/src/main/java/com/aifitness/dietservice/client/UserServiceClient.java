package com.aifitness.dietservice.client;

import com.aifitness.dietservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-service", url = "${user-service.url:http://localhost:8081}")
public interface UserServiceClient {
    @GetMapping("/api/v1/users/id/{id}")
    UserDTO getUserById(@org.springframework.web.bind.annotation.PathVariable("id") UUID id);
}
