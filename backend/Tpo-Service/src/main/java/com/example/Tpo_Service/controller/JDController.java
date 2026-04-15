package com.example.Tpo_Service.controller;

import com.example.Tpo_Service.dto.StudentDTO;
import com.example.Tpo_Service.client.StudentServiceClient;
import com.example.Tpo_Service.dto.JobPostedEvent;
import com.example.Tpo_Service.entity.JD;
import com.example.Tpo_Service.service.JDService;
import com.example.Tpo_Service.service.JobPostedEventProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jd")
public class JDController {

    @Autowired
    private JDService jdService;

    @Autowired
    private StudentServiceClient studentServiceClient;

    @Autowired
    private JobPostedEventProducer jobPostedEventProducer;

    @PostMapping
    public ResponseEntity<JD> createJD(@RequestBody JD jd) {
        JD savedJD = jdService.saveJD(jd);
        publishJobPostedNotification(savedJD);
        return ResponseEntity.ok(savedJD);
    }

    //micrsoservice comm
    @GetMapping
    public ResponseEntity<List<JD>> getAllJDs() {
        List<JD> jds = jdService.getAllJDs();
        return ResponseEntity.ok(jds);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JD> updateJD(@PathVariable Long id, @RequestBody JD jd) {
        JD updatedJD = jdService.updateJD(id, jd);
        return ResponseEntity.ok(updatedJD);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJD(@PathVariable Long id) {
        jdService.deleteJD(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/company/{companyName}/applied-students")
    public ResponseEntity<List<StudentDTO>> getAppliedStudentsForCompany(@PathVariable String companyName) {
        JD jd = jdService.getJDByCompanyName(companyName);
        if (jd == null) {
            return ResponseEntity.notFound().build();
        }
        List<StudentDTO> students = studentServiceClient.getAppliedStudents(jd.getId());
        return ResponseEntity.ok(students);
    }

    private void publishJobPostedNotification(JD jd) {
        List<String> eligibleCourses = parseEligibleCourses(jd.getEligibleDegree());
        if (eligibleCourses.isEmpty()) {
            return;
        }

        List<StudentDTO> eligibleStudents = studentServiceClient.getEligibleStudents(eligibleCourses);
        List<String> recipientEmails = eligibleStudents.stream()
            .map(StudentDTO::getEmail)
            .filter(email -> email != null && !email.isBlank())
            .distinct()
            .collect(Collectors.toList());

        if (recipientEmails.isEmpty()) {
            return;
        }

        JobPostedEvent event = new JobPostedEvent();
        event.setJdId(jd.getId());
        event.setCompanyName(jd.getCompanyName());
        event.setRole(jd.getRole());
        event.setLocation(jd.getLocation());
        event.setSalary(jd.getSalary());
        event.setEligibleDegree(jd.getEligibleDegree());
        event.setEligibleCourses(eligibleCourses);
        event.setRecipientEmails(recipientEmails);
        event.setPostedAt(LocalDateTime.now());
        jobPostedEventProducer.publishJobPosted(event);
    }

    private List<String> parseEligibleCourses(String eligibleDegree) {
        if (eligibleDegree == null || eligibleDegree.isBlank()) {
            return List.of();
        }

        return Arrays.stream(eligibleDegree.split("[,;/|]"))
            .map(String::trim)
            .filter(token -> !token.isBlank())
            .distinct()
            .collect(Collectors.toList());
    }

}
