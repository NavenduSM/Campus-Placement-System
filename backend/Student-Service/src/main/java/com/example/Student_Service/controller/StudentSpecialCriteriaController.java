package com.example.Student_Service.controller;

import com.example.Student_Service.dto.StudentSpecialCriteriaDTO;
import com.example.Student_Service.service.StudentSpecialCriteriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-special-criteria")
public class StudentSpecialCriteriaController {

    @Autowired
    private StudentSpecialCriteriaService studentSpecialCriteriaService;

    @GetMapping
    public ResponseEntity<List<StudentSpecialCriteriaDTO>> getAllSpecialCriteria() {
        List<StudentSpecialCriteriaDTO> criteria = studentSpecialCriteriaService.getAllSpecialCriteria();
        return ResponseEntity.ok(criteria);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentSpecialCriteriaDTO> getSpecialCriteriaByStudentId(@PathVariable Long studentId) {
        Optional<StudentSpecialCriteriaDTO> criteria = studentSpecialCriteriaService.getSpecialCriteriaByStudentId(studentId);
        return criteria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentSpecialCriteriaDTO> createSpecialCriteria(
        @RequestHeader("Authorization") String authorization,
        @RequestBody StudentSpecialCriteriaDTO criteriaDTO
    ) {
        StudentSpecialCriteriaDTO createdCriteria = studentSpecialCriteriaService.createSpecialCriteriaWithAuth(authorization, criteriaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCriteria);
    }

    @PutMapping("/student/{studentId}")
    public ResponseEntity<StudentSpecialCriteriaDTO> updateSpecialCriteria(@PathVariable Long studentId, @RequestBody StudentSpecialCriteriaDTO criteriaDTO) {
        StudentSpecialCriteriaDTO updatedCriteria = studentSpecialCriteriaService.updateSpecialCriteria(studentId, criteriaDTO);
        if (updatedCriteria != null) {
            return ResponseEntity.ok(updatedCriteria);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<Void> deleteSpecialCriteria(@PathVariable Long studentId) {
        studentSpecialCriteriaService.deleteSpecialCriteria(studentId);
        return ResponseEntity.noContent().build();
    }
}
