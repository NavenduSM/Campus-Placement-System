package com.example.Student_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {

    private Long id;
    private String name;
    private Integer age;

    public String getName() {
        return name;
    }
    private String email;
    private String enrollmentNumber;
    private String course;
    private String courseSpecialisation;
    private String status;
    private String phone;
    private String alternatePhone;
    private String address;
    private String resumePath;
    private List<StudentSkillsDTO> skills;
    private List<StudentAcademicsDTO> academics;
    private StudentSpecialCriteriaDTO specialCriteria;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEnrollmentNumber() {
        return enrollmentNumber;
    }

    public void setEnrollmentNumber(String enrollmentNumber) {
        this.enrollmentNumber = enrollmentNumber;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getCourseSpecialisation() {
        return courseSpecialisation;
    }

    public void setCourseSpecialisation(String courseSpecialisation) {
        this.courseSpecialisation = courseSpecialisation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAlternatePhone() {
        return alternatePhone;
    }

    public void setAlternatePhone(String alternatePhone) {
        this.alternatePhone = alternatePhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public List<StudentSkillsDTO> getSkills() {
        return skills;
    }

    public void setSkills(List<StudentSkillsDTO> skills) {
        this.skills = skills;
    }

    public List<StudentAcademicsDTO> getAcademics() {
        return academics;
    }

    public void setAcademics(List<StudentAcademicsDTO> academics) {
        this.academics = academics;
    }

    public StudentSpecialCriteriaDTO getSpecialCriteria() {
        return specialCriteria;
    }

    public void setSpecialCriteria(StudentSpecialCriteriaDTO specialCriteria) {
        this.specialCriteria = specialCriteria;
    }

    public Integer getAge() {
        return age;
    }

    public void setEnrollmentNo(Object enrollmentNo) {
    }
}
