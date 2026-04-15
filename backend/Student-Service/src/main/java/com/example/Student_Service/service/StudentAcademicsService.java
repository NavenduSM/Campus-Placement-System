package com.example.Student_Service.service;

import com.example.Student_Service.dto.StudentAcademicsDTO;
import com.example.Student_Service.entity.Student;
import com.example.Student_Service.entity.StudentAcademics;
import com.example.Student_Service.repository.StudentAcademicsRepository;
import com.example.Student_Service.repository.StudentRepository;
import com.example.Student_Service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentAcademicsService {

    @Autowired
    private StudentAcademicsRepository studentAcademicsRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public List<StudentAcademicsDTO> getAllAcademics() {
        return studentAcademicsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StudentAcademicsDTO> getAcademicsByStudentId(Long studentId) {
        return studentAcademicsRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StudentAcademicsDTO> getAcademicById(Long id) {
        return studentAcademicsRepository.findById(id).map(this::convertToDTO);
    }

    public StudentAcademicsDTO createAcademicWithAuth(String authorization, StudentAcademicsDTO academicDTO) {
        String enrollmentNo = extractEnrollmentFromAuth(authorization);
        Student student = studentRepository.findByEnrollmentNumber(enrollmentNo)
            .orElseThrow(() -> new RuntimeException("Student not found with enrollment number: " + enrollmentNo));
        academicDTO.setStudentId(student.getId());
        StudentAcademics academic = convertToEntity(academicDTO);
        StudentAcademics savedAcademic = studentAcademicsRepository.save(academic);
        return convertToDTO(savedAcademic);
    }

    public StudentAcademicsDTO updateAcademic(Long id, StudentAcademicsDTO academicDTO) {
        Optional<StudentAcademics> existingAcademicOpt = studentAcademicsRepository.findById(id);
        if (existingAcademicOpt.isPresent()) {
            StudentAcademics existingAcademic = existingAcademicOpt.get();
            existingAcademic.setInstitutionName(academicDTO.getInstitutionName());
            existingAcademic.setDegree(academicDTO.getDegree());
            existingAcademic.setStartDate(academicDTO.getStartDate());
            existingAcademic.setEndDate(academicDTO.getEndDate());
            existingAcademic.setScoreType(academicDTO.getScoreType());
            existingAcademic.setScore(academicDTO.getScore());
            if (academicDTO.getStudentId() != null) {
                Optional<Student> studentOpt = studentRepository.findById(academicDTO.getStudentId());
                studentOpt.ifPresent(existingAcademic::setStudent);
            }
            StudentAcademics updatedAcademic = studentAcademicsRepository.save(existingAcademic);
            return convertToDTO(updatedAcademic);
        }
        return null;
    }

    public void deleteAcademic(Long id) {
        studentAcademicsRepository.deleteById(id);
    }

    private StudentAcademicsDTO convertToDTO(StudentAcademics academic) {
        StudentAcademicsDTO dto = new StudentAcademicsDTO();
        dto.setId(academic.getId());
        dto.setStudentId(academic.getStudent().getId());
        dto.setInstitutionName(academic.getInstitutionName());
        dto.setDegree(academic.getDegree());
        dto.setStartDate(academic.getStartDate());
        dto.setEndDate(academic.getEndDate());
        dto.setScoreType(academic.getScoreType());
        dto.setScore(academic.getScore());
        return dto;
    }

    private StudentAcademics convertToEntity(StudentAcademicsDTO dto) {
        StudentAcademics academic = new StudentAcademics();
        academic.setId(dto.getId());
        academic.setInstitutionName(dto.getInstitutionName());
        academic.setDegree(dto.getDegree());
        academic.setStartDate(dto.getStartDate());
        academic.setEndDate(dto.getEndDate());
        academic.setScoreType(dto.getScoreType());
        academic.setScore(dto.getScore());
        if (dto.getStudentId() != null) {
            Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
            if (studentOpt.isPresent()) {
                academic.setStudent(studentOpt.get());
            }
        }
        return academic;
    }

    private String extractEnrollmentFromAuth(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authorization.substring(7);
        String enrollmentNo = jwtUtil.extractClaim(token, "enrollmentNo");
        if (enrollmentNo == null || enrollmentNo.isBlank()) {
            throw new RuntimeException("Enrollment number not found in token");
        }
        return enrollmentNo;
    }
}
