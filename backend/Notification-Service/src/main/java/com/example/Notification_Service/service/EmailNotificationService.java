package com.example.Notification_Service.service;

import com.example.Notification_Service.dto.ApplicationCreatedEvent;
import com.example.Notification_Service.dto.ApplicationStatusUpdatedEvent;
import com.example.Notification_Service.dto.JobPostedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailNotificationService(
        JavaMailSender mailSender,
        @Value("${app.mail.from}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendApplicationCreatedEmail(ApplicationCreatedEvent event) {
        if (event.getStudentEmail() == null || event.getStudentEmail().isBlank()) {
            log.warn("Skipping application-created email; studentEmail missing for applicationId={}", event.getApplicationId());
            return;
        }

        String subject = "Application Submitted Successfully";
        String body = String.format(
            "Hi %s,%n%nYour application has been submitted successfully.%n%nApplication ID: %s%nEnrollment No: %s%nJob ID: %s%nStatus: %s%n%nRegards,%nPlacement Cell",
            safe(event.getStudentName()),
            safe(event.getApplicationId()),
            safe(event.getEnrollmentNo()),
            safe(event.getJdId()),
            safe(event.getStatus())
        );

        send(event.getStudentEmail(), subject, body);
    }

    public void sendApplicationStatusUpdatedEmail(ApplicationStatusUpdatedEvent event) {
        if (event.getStudentEmail() == null || event.getStudentEmail().isBlank()) {
            log.warn("Skipping status-update email; studentEmail missing for applicationId={}", event.getApplicationId());
            return;
        }

        String subject = "Application Status Updated";
        String body = String.format(
            "Hi %s,%n%nYour application status has been updated.%n%nApplication ID: %s%nEnrollment No: %s%nJob ID: %s%nPrevious Status: %s%nNew Status: %s%n%nRegards,%nPlacement Cell",
            safe(event.getStudentName()),
            safe(event.getApplicationId()),
            safe(event.getEnrollmentNo()),
            safe(event.getJdId()),
            safe(event.getPreviousStatus()),
            safe(event.getNewStatus())
        );

        send(event.getStudentEmail(), subject, body);
    }

    public void sendJobPostedEmail(JobPostedEvent event) {
        List<String> recipients = event.getRecipientEmails();
        if (recipients == null || recipients.isEmpty()) {
            log.warn("Skipping job-posted email; no recipients for jdId={}", event.getJdId());
            return;
        }

        String subject = String.format("New Job Opportunity - %s", safe(event.getCompanyName()));
        String eligibleCourses = event.getEligibleCourses() == null
            ? "-"
            : event.getEligibleCourses().stream().collect(Collectors.joining(", "));
        String body = String.format(
            "Hi Student,%n%nA new job has been posted that matches your course.%n%nCompany: %s%nRole: %s%nLocation: %s%nSalary: %s%nEligible Courses: %s%nJob ID: %s%n%nRegards,%nPlacement Cell",
            safe(event.getCompanyName()),
            safe(event.getRole()),
            safe(event.getLocation()),
            safe(event.getSalary()),
            eligibleCourses,
            safe(event.getJdId())
        );

        for (String recipient : recipients) {
            if (recipient == null || recipient.isBlank()) {
                continue;
            }
            send(recipient, subject, body);
        }
    }

    private void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        log.info("Email sent to {}", to);
    }

    private String safe(Object value) {
        return value == null ? "-" : String.valueOf(value);
    }
}
