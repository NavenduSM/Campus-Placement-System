package com.example.Student_Service.service;

import com.example.Student_Service.dto.StudentSpecialCriteriaDTO;
import com.example.Student_Service.entity.Student;
import com.example.Student_Service.entity.StudentSpecialCriteria;
import com.example.Student_Service.repository.StudentRepository;
import com.example.Student_Service.repository.StudentSpecialCriteriaRepository;
import com.example.Student_Service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentSpecialCriteriaService {

    @Autowired
    private StudentSpecialCriteriaRepository studentSpecialCriteriaRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public List<StudentSpecialCriteriaDTO> getAllSpecialCriteria() {
        return studentSpecialCriteriaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StudentSpecialCriteriaDTO> getSpecialCriteriaByStudentId(Long studentId) {
        return studentSpecialCriteriaRepository.findByStudentId(studentId).map(this::convertToDTO);
    }

    public StudentSpecialCriteriaDTO createSpecialCriteriaWithAuth(String authorization, StudentSpecialCriteriaDTO criteriaDTO) {
        String enrollmentNo = extractEnrollmentFromAuth(authorization);
        Student student = studentRepository.findByEnrollmentNumber(enrollmentNo)
            .orElseThrow(() -> new RuntimeException("Student not found with enrollment number: " + enrollmentNo));
        StudentSpecialCriteria criteria = new StudentSpecialCriteria();
        criteria.setStudent(student);
        criteria.setHasBacklog(criteriaDTO.getHasBacklog());
        criteria.setGapYear(criteriaDTO.getGapYear());
        criteria.setComputerScience(criteriaDTO.getComputerScience());
        criteria.setMathematics(criteriaDTO.getMathematics());
        criteria.setCommerce(criteriaDTO.getCommerce());
        criteria.setArts(criteriaDTO.getArts());
        criteria.setScience(criteriaDTO.getScience());
        StudentSpecialCriteria savedCriteria = studentSpecialCriteriaRepository.save(criteria);
        return convertToDTO(savedCriteria);
    }

    public StudentSpecialCriteriaDTO updateSpecialCriteria(Long studentId, StudentSpecialCriteriaDTO criteriaDTO) {
        Optional<StudentSpecialCriteria> existingCriteriaOpt = studentSpecialCriteriaRepository.findById(studentId);
        if (existingCriteriaOpt.isPresent()) {
            StudentSpecialCriteria existingCriteria = existingCriteriaOpt.get();
            existingCriteria.setHasBacklog(criteriaDTO.getHasBacklog());
            existingCriteria.setGapYear(criteriaDTO.getGapYear());
            existingCriteria.setComputerScience(criteriaDTO.getComputerScience());
            existingCriteria.setMathematics(criteriaDTO.getMathematics());
            existingCriteria.setCommerce(criteriaDTO.getCommerce());
            existingCriteria.setArts(criteriaDTO.getArts());
            existingCriteria.setScience(criteriaDTO.getScience());
            StudentSpecialCriteria updatedCriteria = studentSpecialCriteriaRepository.save(existingCriteria);
            return convertToDTO(updatedCriteria);
        }
        return null;
    }

    public void deleteSpecialCriteria(Long studentId) {
        studentSpecialCriteriaRepository.deleteById(studentId);
    }

    private StudentSpecialCriteriaDTO convertToDTO(StudentSpecialCriteria criteria) {
        StudentSpecialCriteriaDTO dto = new StudentSpecialCriteriaDTO();
        dto.setStudentId(criteria.getStudentId());
        dto.setHasBacklog(criteria.getHasBacklog());
        dto.setGapYear(criteria.getGapYear());
        dto.setComputerScience(criteria.getComputerScience());
        dto.setMathematics(criteria.getMathematics());
        dto.setCommerce(criteria.getCommerce());
        dto.setArts(criteria.getArts());
        dto.setScience(criteria.getScience());
        return dto;
    }

    private StudentSpecialCriteria convertToEntity(StudentSpecialCriteriaDTO dto) {
        if (dto.getStudentId() == null) {
            throw new RuntimeException("studentId is required");
        }
        StudentSpecialCriteria criteria = new StudentSpecialCriteria();
        criteria.setStudentId(dto.getStudentId());
        criteria.setHasBacklog(dto.getHasBacklog());
        criteria.setGapYear(dto.getGapYear());
        criteria.setComputerScience(dto.getComputerScience());
        criteria.setMathematics(dto.getMathematics());
        criteria.setCommerce(dto.getCommerce());
        criteria.setArts(dto.getArts());
        criteria.setScience(dto.getScience());
        
        // Fetch and set the Student entity - throw exception if not found
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + dto.getStudentId()));
            criteria.setStudent(student);
        }
        return criteria;
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
