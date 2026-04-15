package com.example.Tpo_Service.dto;

import com.example.Tpo_Service.entity.Application;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationWithResumeDTO {
    private Long id;
    private Long studentId;
    private Long jdId;
    private String enrollmentNo;
    private String studentName;
    private LocalDateTime appliedDate;
    private byte[] resume;
    private String status;

    /**
     * Converts the individual fields to an Application entity
     */
    public Application getApplication() {
        Application app = new Application();
        app.setId(this.id);
        app.setStudentId(this.studentId);
        app.setJdId(this.jdId);
        app.setEnrollmentNo(this.enrollmentNo);
        app.setStudentName(this.studentName);
        app.setAppliedDate(this.appliedDate);
        app.setStatus(this.status);
        return app;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getJdId() {
        return jdId;
    }

    public void setJdId(Long jdId) {
        this.jdId = jdId;
    }

    public String getEnrollmentNo() {
        return enrollmentNo;
    }

    public void setEnrollmentNo(String enrollmentNo) {
        this.enrollmentNo = enrollmentNo;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }

    public byte[] getResume() {
        return resume;
    }

    public void setResume(byte[] resume) {
        this.resume = resume;
    }
}
