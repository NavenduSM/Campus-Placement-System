package com.example.Tpo_Service.client;

import com.example.Tpo_Service.entity.Offer;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Old: @FeignClient(name = "student-service-offer", url = "http://localhost:8081")
@FeignClient(
    name = "student-service-offer",
    url = "${student.service.url:http://localhost:8081}",
    configuration = com.example.Tpo_Service.config.FeignAuthConfig.class
)
public interface StudentServiceOfferClient {

    @PostMapping("/api/offers/receive")
    void sendOfferToStudent(@RequestBody Offer offer);

    @PutMapping("/api/applications/{id}/status")
    void updateApplicationStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request);

    public static class StatusUpdateRequest {
        private String status;

        public StatusUpdateRequest(String status) {
            this.status = status;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
