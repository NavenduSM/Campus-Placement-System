package com.example.Tpo_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TpoServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TpoServiceApplication.class, args);
	}

}
