package com.example.Tpo_Service.dto;

public class StatusUpdateFromCSVDTO {
    private String enrollmentNo;
    private String name;
    private String phoneNo;
    private String status;
    private Long jdId;

    public StatusUpdateFromCSVDTO() {
    }

    public StatusUpdateFromCSVDTO(String enrollmentNo, String name, String phoneNo, String status, Long jdId) {
        this.enrollmentNo = enrollmentNo;
        this.name = name;
        this.phoneNo = phoneNo;
        this.status = status;
        this.jdId = jdId;
    }

    public String getEnrollmentNo() {
        return enrollmentNo;
    }

    public void setEnrollmentNo(String enrollmentNo) {
        this.enrollmentNo = enrollmentNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getJdId() {
        return jdId;
    }

    public void setJdId(Long jdId) {
        this.jdId = jdId;
    }

    @Override
    public String toString() {
        return "StatusUpdateFromCSVDTO{" +
                "enrollmentNo='" + enrollmentNo + '\'' +
                ", name='" + name + '\'' +
                ", phoneNo='" + phoneNo + '\'' +
                ", status='" + status + '\'' +
                ", jdId=" + jdId +
                '}';
    }
}
