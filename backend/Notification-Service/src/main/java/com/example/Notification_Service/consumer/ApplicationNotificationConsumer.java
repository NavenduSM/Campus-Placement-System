package com.example.Notification_Service.consumer;

import com.example.Notification_Service.dto.ApplicationCreatedEvent;
import com.example.Notification_Service.dto.ApplicationStatusUpdatedEvent;
import com.example.Notification_Service.dto.JobPostedEvent;
import com.example.Notification_Service.service.EmailNotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ApplicationNotificationConsumer {

    private final ObjectMapper objectMapper;
    private final EmailNotificationService emailNotificationService;

    public ApplicationNotificationConsumer(
        ObjectMapper objectMapper,
        EmailNotificationService emailNotificationService
    ) {
        this.objectMapper = objectMapper;
        this.objectMapper.registerModule(new JavaTimeModule());
        this.emailNotificationService = emailNotificationService;
    }

    @KafkaListener(
        topics = "${app.kafka.topic.application-created}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onApplicationCreated(String payload) {
        try {
            ApplicationCreatedEvent event = objectMapper.readValue(payload, ApplicationCreatedEvent.class);
            emailNotificationService.sendApplicationCreatedEmail(event);
            log.info("Processed application-created event for applicationId={}", event.getApplicationId());
        } catch (Exception ex) {
            log.error("Failed to process application-created event payload={}", payload, ex);
        }
    }

    @KafkaListener(
        topics = "${app.kafka.topic.application-status-updated}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onApplicationStatusUpdated(String payload) {
        try {
            ApplicationStatusUpdatedEvent event = objectMapper.readValue(payload, ApplicationStatusUpdatedEvent.class);
            emailNotificationService.sendApplicationStatusUpdatedEmail(event);
            log.info("Processed application-status-updated event for applicationId={}", event.getApplicationId());
        } catch (Exception ex) {
            log.error("Failed to process application-status-updated event payload={}", payload, ex);
        }
    }

    @KafkaListener(
        topics = "${app.kafka.topic.job-posted}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onJobPosted(String payload) {
        try {
            JobPostedEvent event = objectMapper.readValue(payload, JobPostedEvent.class);
            emailNotificationService.sendJobPostedEmail(event);
            log.info("Processed job-posted event for jdId={}", event.getJdId());
        } catch (Exception ex) {
            log.error("Failed to process job-posted event payload={}", payload, ex);
        }
    }
}
