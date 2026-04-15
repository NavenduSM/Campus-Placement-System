package com.example.Tpo_Service.service;

import com.example.Tpo_Service.client.StudentServiceOfferClient;
import com.example.Tpo_Service.client.StudentServiceClient;
import com.example.Tpo_Service.dto.ApplicationStatusUpdatedEvent;
import com.example.Tpo_Service.dto.ApplicationWithResumeDTO;
import com.example.Tpo_Service.dto.StatusUpdateFromCSVDTO;
import com.example.Tpo_Service.dto.StudentDTO;
import com.example.Tpo_Service.entity.Application;
import com.example.Tpo_Service.repository.ApplicationRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentServiceOfferClient studentServiceOfferClient;

    @Autowired
    private StudentServiceClient studentServiceClient;

    @Autowired
    private ApplicationStatusEventProducer applicationStatusEventProducer;

    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }

    public Application saveApplication(ApplicationWithResumeDTO applicationWithResume) {
        Application application = applicationWithResume.getApplication();
        byte[] resume = applicationWithResume.getResume();
        if (resume != null && resume.length > 0) {
            try {
                // Create resumes directory if it doesn't exist
                Path resumesDir = Paths.get("resumes");
                if (!Files.exists(resumesDir)) {
                    Files.createDirectories(resumesDir);
                }
                // Save resume file with application ID as filename
                String fileName = application.getId() + ".pdf"; // Assuming PDF, adjust if needed
                Path filePath = resumesDir.resolve(fileName);
                Files.write(filePath, resume, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
                application.setResumePath(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Error saving resume file", e);
            }
        }
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJdId(Long jdId) {
        return applicationRepository.findByJdId(jdId);
    }

    public Application updateApplicationStatus(Long id, String status) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        String previousStatus = application.getStatus();
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        sendStatusUpdatedNotification(updatedApplication, previousStatus);
        return updatedApplication;
    }

    public List<StudentDTO> getAppliedStudents(Long jdId) {
        List<Application> applications = getApplicationsByJdId(jdId);
        return applications.stream()
            .map(app -> {
                // Assuming StudentDTO is populated from application data or external call
                StudentDTO dto = new StudentDTO();
                dto.setId(app.getStudentId());
                dto.setName(app.getStudentName());
                dto.setEnrollmentNumber(app.getEnrollmentNo());
                dto.setStatus(app.getStatus());
                // Add other fields as needed
                return dto;
            })
            .collect(Collectors.toList());
    }

    public String getApplicationStatus(Long id) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        return application.getStatus();
    }

    /**
     * Process CSV file and update application statuses
     * CSV format: enrollmentNo,name,phoneNo,status,jdId
     * @param file CSV file containing status updates
     * @return Map containing success and failure counts
     */
    public Map<String, Object> bulkUpdateStatusFromCSV(MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        List<String> successfulUpdates = new ArrayList<>();
        List<String> failedUpdates = new ArrayList<>();
        int totalProcessed = 0;
        
        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = csvReader.readAll();
            totalProcessed = Math.max(0, rows.size() - 1);
            
            // Skip header row
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    if (row.length < 1) {
                        failedUpdates.add("Row " + (i + 1) + ": Insufficient data");
                        continue;
                    }

                    String enrollmentNo = row[0].trim();
                    String name = row[1].trim();
                    String phoneNo = row[2].trim();
                    String status = row[3].trim();
                    Long jdId = Long.parseLong(row[4].trim());
                    
                    // Find application by enrollmentNo and jdId
                    Application application = applicationRepository.findByEnrollmentNoAndJdId(enrollmentNo, jdId);
                    
                    if (application == null) {
                        failedUpdates.add("Row " + (i + 1) + ": Application not found for enrollmentNo: " + enrollmentNo + ", jdId: " + jdId);
                        continue;
                    }
                    
                    // Update status in TPO database
                    String previousStatus = application.getStatus();
                    application.setStatus(status);
                    applicationRepository.save(application);
                    
                    // Sync to Student Service
                    try {
                        studentServiceOfferClient.updateApplicationStatus(application.getId(), 
                            new StudentServiceOfferClient.StatusUpdateRequest(status));
                    } catch (Exception e) {
                        // Log error but continue with other updates
                        failedUpdates.add("Row " + (i + 1) + ": Updated in TPO but failed to sync to Student Service: " + e.getMessage());
                        continue;
                    }

                    sendStatusUpdatedNotification(application, previousStatus);
                    
                    successfulUpdates.add("Row " + (i + 1) + ": " + enrollmentNo + " - " + status);
                    
                } catch (Exception e) {
                    failedUpdates.add("Row " + (i + 1) + ": " + e.getMessage());
                }
            }
            
        } catch (IOException | CsvException e) {
            throw new RuntimeException("Error processing CSV file: " + e.getMessage());
        }
        
        result.put("totalProcessed", totalProcessed);
        result.put("successfulCount", successfulUpdates.size());
        result.put("failedCount", failedUpdates.size());
        result.put("successfulUpdates", successfulUpdates);
        result.put("failedUpdates", failedUpdates);
        
        return result;
    }

    private void sendStatusUpdatedNotification(Application application, String previousStatus) {
        try {
            StudentDTO student = studentServiceClient.getStudentById(application.getStudentId());
            ApplicationStatusUpdatedEvent event = new ApplicationStatusUpdatedEvent();
            event.setApplicationId(application.getId());
            event.setStudentId(application.getStudentId());
            event.setJdId(application.getJdId());
            event.setEnrollmentNo(application.getEnrollmentNo());
            event.setStudentName(application.getStudentName());
            event.setStudentEmail(student != null ? student.getEmail() : null);
            event.setPreviousStatus(previousStatus);
            event.setNewStatus(application.getStatus());
            event.setUpdatedAt(LocalDateTime.now());
            applicationStatusEventProducer.publishStatusUpdated(event);
        } catch (Exception e) {
            // Do not fail the main business flow if notification dispatch fails.
            log.error("Failed to send status notification for applicationId={}", application.getId(), e);
        }
    }
}
