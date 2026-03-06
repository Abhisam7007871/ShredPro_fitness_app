package com.aifitness.dietservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class DietServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DietServiceApplication.class, args);
    }
}
