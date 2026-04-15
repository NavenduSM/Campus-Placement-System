package com.example.Student_Service.client;

import com.example.Student_Service.dto.ApplicationWithResumeDTO;
import com.example.Student_Service.dto.JobDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

// @FeignClient(name = "tpo-service", url = "http://localhost:8080")
@FeignClient(
    name = "tpo-service",
    url = "${tpo.service.url:http://localhost:8080}",
    configuration = com.example.Student_Service.config.FeignAuthConfig.class
)
public interface TpoServiceClient {

    @PostMapping("/api/applications/receive")
    void sendApplicationToTpo(@RequestBody ApplicationWithResumeDTO applicationWithResume);

    @GetMapping("/api/jd")
    List<JobDTO> getAllJobs();
}
