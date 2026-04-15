package com.example.Tpo_Service.service;

import com.example.Tpo_Service.dto.ApplicationStatusUpdatedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ApplicationStatusEventProducer {
    private static final Logger log = LoggerFactory.getLogger(ApplicationStatusEventProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;

    public ApplicationStatusEventProducer(
        KafkaTemplate<String, String> kafkaTemplate,
        ObjectMapper objectMapper,
        @Value("${app.kafka.topic.application-status-updated}") String topic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    public void publishStatusUpdated(ApplicationStatusUpdatedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, payload);
            log.info("Published application-status-updated event to topic={} applicationId={}", topic, event.getApplicationId());
        } catch (Exception ex) {
            throw new RuntimeException(
                "Failed to publish application-status-updated event for applicationId=" + event.getApplicationId(),
                ex
            );
        }
    }
}
