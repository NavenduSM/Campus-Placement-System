package com.example.Tpo_Service.controller;

import com.example.Tpo_Service.client.StudentServiceOfferClient;
import com.example.Tpo_Service.dto.ApplicationWithResumeDTO;
import com.example.Tpo_Service.dto.StudentDTO;
import com.example.Tpo_Service.entity.Application;
import com.example.Tpo_Service.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private StudentServiceOfferClient studentServiceOfferClient;

    @PostMapping("/receive")
    public ResponseEntity<Application> receiveApplication(@RequestBody ApplicationWithResumeDTO applicationWithResume) {
        Application savedApplication = applicationService.saveApplication(applicationWithResume);
        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping("/{jdId}/students")
    public ResponseEntity<List<StudentDTO>> getAppliedStudents(@PathVariable Long jdId) {
        List<StudentDTO> students = applicationService.getAppliedStudents(jdId);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<String> getApplicationStatus(@PathVariable Long id) {
        String status = applicationService.getApplicationStatus(id);
        return ResponseEntity.ok(status);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        // Update status in TPO service
        Application updatedApplication = applicationService.updateApplicationStatus(id, request.getStatus());
        // Sync to Student service
        studentServiceOfferClient.updateApplicationStatus(id, new StudentServiceOfferClient.StatusUpdateRequest(request.getStatus()));
        return ResponseEntity.ok(updatedApplication);
    }

    /**
     * Bulk update application statuses from CSV file
     * CSV format: enrollmentNo,name,phoneNo,status,jdId
     */
    @PostMapping("/bulk-update-status")
    public ResponseEntity<Map<String, Object>> bulkUpdateStatusFromCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload a CSV file"));
        }
        
        Map<String, Object> result = applicationService.bulkUpdateStatusFromCSV(file);
        return ResponseEntity.ok(result);
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ApplyRequest {
        private Long studentId;
        private Long jdId;
        private String enrollmentNo;
        private String studentName;

        // Getters and setters
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getJdId() { return jdId; }
        public void setJdId(Long jdId) { this.jdId = jdId; }
        public String getEnrollmentNo() { return enrollmentNo; }
        public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
    }
}
