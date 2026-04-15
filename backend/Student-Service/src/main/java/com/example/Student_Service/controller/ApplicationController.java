package com.example.Student_Service.controller;

import com.example.Student_Service.dto.AppliedJobDTO;
import com.example.Student_Service.dto.JobDTO;
import com.example.Student_Service.dto.StudentDTO;
import com.example.Student_Service.entity.Application;
import com.example.Student_Service.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/applications/apply")
    public ResponseEntity<Application> applyForJob(@RequestBody ApplyRequest request) {
        Application application = applicationService.applyForJob(
            request.getEnrollmentNo(),
            request.getJdId()
        );
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications/{jdId}/students")
    public ResponseEntity<List<StudentDTO>> getAppliedStudents(@PathVariable Long jdId) {
        List<StudentDTO> students = applicationService.getAppliedStudents(jdId);
        return ResponseEntity.ok(students);
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Application updatedApplication = applicationService.updateApplicationStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedApplication);
    }


    @GetMapping("/student/{studentId}/applied-jobs")
    public ResponseEntity<List<AppliedJobDTO>> getAppliedJobs(@PathVariable Long studentId) {
        List<AppliedJobDTO> appliedJobs = applicationService.getAppliedJobs(studentId);
        return ResponseEntity.ok(appliedJobs);
    }

    @GetMapping("/student/enrollment/{enrollmentNo}/applied-jobs")
    public ResponseEntity<List<AppliedJobDTO>> getAppliedJobsByEnrollmentNo(@PathVariable String enrollmentNo) {
        List<AppliedJobDTO> appliedJobs = applicationService.getAppliedJobsByEnrollmentNo(enrollmentNo);
        return ResponseEntity.ok(appliedJobs);
    }


    @PostMapping("/applications/{applicationId}/withdraw")
    public ResponseEntity<Application> withdrawApplication(@PathVariable Long applicationId) {
        Application application = applicationService.withdrawApplication(applicationId);
        return ResponseEntity.ok(application);
    }


    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        List<JobDTO> jobs = applicationService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ApplyRequest {
        private Long jdId;
        private String enrollmentNo;

        // Getters and setters
        public Long getJdId() { return jdId; }
        public void setJdId(Long jdId) { this.jdId = jdId; }
        public String getEnrollmentNo() { return enrollmentNo; }
        public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }
    }
}
