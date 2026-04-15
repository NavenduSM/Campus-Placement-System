package com.example.Tpo_Service.client;


import com.example.Tpo_Service.dto.StudentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

// Old: @FeignClient(name = "student-service", url = "http://localhost:8081")
@FeignClient(
    name = "student-service",
    url = "${student.service.url:http://localhost:8081}",
    configuration = com.example.Tpo_Service.config.FeignAuthConfig.class
)
public interface StudentServiceClient {

    @GetMapping("/api/applications/{jdId}/students")
    List<StudentDTO> getAppliedStudents(@PathVariable("jdId") Long jdId);

    @GetMapping("/api/students/{id}")
    StudentDTO getStudentById(@PathVariable("id") Long id);

    @GetMapping("/api/students/enrollment/{enrollmentNo}")
    StudentDTO getStudentByEnrollmentNo(@PathVariable("enrollmentNo") String enrollmentNo);

    @GetMapping("/api/students/eligible")
    List<StudentDTO> getEligibleStudents(@RequestParam("courses") List<String> courses);
}
