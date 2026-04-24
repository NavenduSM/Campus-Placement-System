package com.example.Student_Service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
    name = "tpo-offer-client",
    url = "${tpo.service.url:http://localhost:8083}"
)
public interface TpoOfferClient {
    
    @GetMapping("/api/offers/{id}/download")
    ResponseEntity<Resource> downloadOfferLetter(@PathVariable("id") Long id);
}
