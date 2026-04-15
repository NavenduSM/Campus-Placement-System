package com.example.Student_Service.service;

import com.example.Student_Service.client.TpoServiceClient;
import com.example.Student_Service.dto.AppliedJobDTO;
import com.example.Student_Service.dto.ApplicationCreatedEvent;
import com.example.Student_Service.dto.ApplicationWithResumeDTO;
import com.example.Student_Service.dto.JobDTO;
import com.example.Student_Service.dto.StudentDTO;
import com.example.Student_Service.entity.Application;
import com.example.Student_Service.entity.Student;
import com.example.Student_Service.repository.ApplicationRepository;
import com.example.Student_Service.repository.StudentRepository;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Data
public class ApplicationService {
    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TpoServiceClient tpoServiceClient;

    @Autowired
    private ApplicationEventProducer applicationEventProducer;

    public Application applyForJob(String enrollmentNo, Long jdId) {
        if (enrollmentNo == null || enrollmentNo.isBlank()) {
            throw new RuntimeException("Enrollment number is required");
        }
        Student student = studentRepository.findByEnrollmentNumber(enrollmentNo)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        String effectiveEnrollmentNo = student.getEnrollmentNumber();
          
        if (applicationRepository.existsByEnrollmentNoAndJdId(effectiveEnrollmentNo, jdId)) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = new Application();
        application.setStudentId(student.getId());
        application.setJdId(jdId);
        application.setEnrollmentNo(effectiveEnrollmentNo);
        application.setStudentName(student.getName());
        application.setAppliedDate(LocalDateTime.now());
        application.setStatus("Applied");
        Application savedApplication = applicationRepository.save(application);

        // Attach resume if present.
        byte[] resume = null;
        if (student.getResumePath() != null) {
            try {
                resume = Files.readAllBytes(Paths.get(student.getResumePath()));
            } catch (IOException e) {
                throw new RuntimeException("Error reading resume file", e);
            }
        }

        // Send to TPO with resume
        ApplicationWithResumeDTO dto = new ApplicationWithResumeDTO();
        dto.setId(savedApplication.getId());
        dto.setStudentId(savedApplication.getStudentId());
        dto.setJdId(savedApplication.getJdId());
        dto.setEnrollmentNo(savedApplication.getEnrollmentNo());
        dto.setStudentName(savedApplication.getStudentName());
        dto.setAppliedDate(savedApplication.getAppliedDate());
        dto.setStatus(savedApplication.getStatus());
        dto.setResume(resume);
        tpoServiceClient.sendApplicationToTpo(dto);

        ApplicationCreatedEvent event = new ApplicationCreatedEvent();
        event.setApplicationId(savedApplication.getId());
        event.setStudentId(savedApplication.getStudentId());
        event.setJdId(savedApplication.getJdId());
        event.setEnrollmentNo(savedApplication.getEnrollmentNo());
        event.setStudentName(savedApplication.getStudentName());
        event.setStudentEmail(student.getEmail());
        event.setAppliedDate(savedApplication.getAppliedDate());
        event.setStatus(savedApplication.getStatus());
        try {
            applicationEventProducer.publishApplicationCreated(event);
        } catch (Exception ex) {
            log.error("Failed to publish application-created event for applicationId={}", savedApplication.getId(), ex);
        }

        return savedApplication;
    }







    public List<Application> getApplicationsByJdId(Long jdId) {
        return applicationRepository.findByJdId(jdId);
    }

    public List<StudentDTO> getAppliedStudentsByJdId(Long jdId) {
        List<Application> applications = applicationRepository.findByJdId(jdId);
        return applications.stream().map(app -> {
            Student student = studentRepository.findById(app.getStudentId()).orElse(null);
            if (student != null) {
                StudentDTO dto = new StudentDTO();
                dto.setId(student.getId());
                dto.setName(student.getName());
                dto.setEmail(student.getEmail());
                dto.setEnrollmentNo(student.getEnrollmentNo());
                dto.setStatus(app.getStatus());
                // Add other fields as needed
                return dto;
            }
            return null;
        }).filter(dto -> dto != null).collect(Collectors.toList());
    }

    public List<StudentDTO> getAppliedStudents(Long jdId) {
        List<Application> applications = getApplicationsByJdId(jdId);
        return applications.stream()
            .map(app -> {
                Student student = studentRepository.findById(app.getStudentId()).orElse(null);
                if (student == null) return null;
                StudentDTO dto = new StudentDTO();
                dto.setId(student.getId());
                dto.setName(student.getName());
                dto.setAge(student.getAge());
                dto.setEmail(student.getEmail());
                dto.setEnrollmentNumber(student.getEnrollmentNumber());
                dto.setCourse(student.getCourse());
                dto.setCourseSpecialisation(student.getCourseSpecialisation());
                dto.setPhone(student.getPhone());
                dto.setAlternatePhone(student.getAlternatePhone());
                dto.setAddress(student.getAddress());
                dto.setResumePath(student.getResumePath());
                dto.setStatus(app.getStatus());
                dto.setSkills(null); // TODO: map if needed
                dto.setAcademics(null); // TODO: map if needed
                dto.setSpecialCriteria(null); // TODO: map if needed
                return dto;
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());
    }

    public Application updateApplicationStatus(Long id, String status) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    /**
     * Get list of jobs that a student has applied to
     * @param studentId The ID of the student
     * @return List of AppliedJobDTO containing company name, role, and status
     */
    public List<AppliedJobDTO> getAppliedJobs(Long studentId) {
        // Get all applications for the student
        List<Application> applications = applicationRepository.findByStudentId(studentId);
        
        // Get all jobs from TPO service
        List<JobDTO> allJobs = tpoServiceClient.getAllJobs();
        
        // Create a map of jdId to JobDTO for quick lookup
        Map<Long, JobDTO> jobsMap = allJobs.stream()
            .collect(Collectors.toMap(JobDTO::getId, job -> job));
        
        // Map applications to AppliedJobDTO
        return applications.stream()
            .map(app -> {
                AppliedJobDTO dto = new AppliedJobDTO();
                dto.setApplicationId(app.getId());
                dto.setJdId(app.getJdId());
                dto.setStatus(app.getStatus());
                dto.setAppliedDate(app.getAppliedDate());
                
                // Get job details from the map
                JobDTO job = jobsMap.get(app.getJdId());
                if (job != null) {
                    dto.setCompanyName(job.getCompanyName());
                    dto.setRole(job.getRole());
                    dto.setSalary(job.getSalary());
                    dto.setLocation(job.getLocation());
                }
                
                return dto;
            })
            .collect(Collectors.toList());
    }

    public List<AppliedJobDTO> getAppliedJobsByEnrollmentNo(String enrollmentNo) {
        Student student = studentRepository.findByEnrollmentNumber(enrollmentNo)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return getAppliedJobs(student.getId());
    }

    /**
     * Withdraw an application
     * @param applicationId The ID of the application to withdraw
     * @return The updated application
     */
    public Application withdrawApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        // Check if the application can be withdrawn (not already withdrawn or rejected)
        if ("Withdrawn".equals(application.getStatus())) {
            throw new RuntimeException("Application is already withdrawn");
        }
        
        application.setStatus("Withdrawn");
        return applicationRepository.save(application);
    }

    /**
     * Get all jobs from TPO Service
     * @return List of all available jobs
     */
    public List<JobDTO> getAllJobs() {
        return tpoServiceClient.getAllJobs();
    }
}
