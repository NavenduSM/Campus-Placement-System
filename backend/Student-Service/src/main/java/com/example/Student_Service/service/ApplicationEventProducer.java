package com.example.Student_Service.service;

import com.example.Student_Service.dto.ApplicationCreatedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ApplicationEventProducer {
    private static final Logger log = LoggerFactory.getLogger(ApplicationEventProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String applicationCreatedTopic;

    public ApplicationEventProducer(
        KafkaTemplate<String, String> kafkaTemplate,
        ObjectMapper objectMapper,
        @Value("${app.kafka.topic.application-created}") String applicationCreatedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.applicationCreatedTopic = applicationCreatedTopic;
    }

    public void publishApplicationCreated(ApplicationCreatedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(applicationCreatedTopic, payload);
            log.info(
                "Published application-created event to topic={} applicationId={}",
                applicationCreatedTopic,
                event.getApplicationId()
            );
        } catch (Exception ex) {
            throw new RuntimeException(
                "Failed to publish application-created event for applicationId=" + event.getApplicationId(),
                ex
            );
        }
    }
}
