package com.example.Tpo_Service.service;

import com.example.Tpo_Service.dto.JobPostedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class JobPostedEventProducer {
    private static final Logger log = LoggerFactory.getLogger(JobPostedEventProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;

    public JobPostedEventProducer(
        KafkaTemplate<String, String> kafkaTemplate,
        ObjectMapper objectMapper,
        @Value("${app.kafka.topic.job-posted}") String topic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    public void publishJobPosted(JobPostedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, payload);
            log.info("Published job-posted event to topic={} jdId={} recipients={}",
                topic, event.getJdId(), event.getRecipientEmails() == null ? 0 : event.getRecipientEmails().size());
        } catch (Exception ex) {
            throw new RuntimeException("Failed to publish job-posted event for jdId=" + event.getJdId(), ex);
        }
    }
}
