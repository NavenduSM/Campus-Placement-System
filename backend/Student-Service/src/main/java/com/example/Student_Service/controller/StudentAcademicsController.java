package com.example.Student_Service.controller;

import com.example.Student_Service.dto.StudentAcademicsDTO;
import com.example.Student_Service.service.StudentAcademicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-academics")
public class StudentAcademicsController {

    @Autowired
    private StudentAcademicsService studentAcademicsService;

    @GetMapping
    public ResponseEntity<List<StudentAcademicsDTO>> getAllAcademics() {
        List<StudentAcademicsDTO> academics = studentAcademicsService.getAllAcademics();
        return ResponseEntity.ok(academics);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentAcademicsDTO>> getAcademicsByStudentId(@PathVariable Long studentId) {
        List<StudentAcademicsDTO> academics = studentAcademicsService.getAcademicsByStudentId(studentId);
        return ResponseEntity.ok(academics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentAcademicsDTO> getAcademicById(@PathVariable Long id) {
        Optional<StudentAcademicsDTO> academic = studentAcademicsService.getAcademicById(id);
        return academic.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentAcademicsDTO> createAcademic(
        @RequestHeader("Authorization") String authorization,
        @RequestBody StudentAcademicsDTO academicDTO
    ) {
        StudentAcademicsDTO createdAcademic = studentAcademicsService.createAcademicWithAuth(authorization, academicDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAcademic);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentAcademicsDTO> updateAcademic(@PathVariable Long id, @RequestBody StudentAcademicsDTO academicDTO) {
        StudentAcademicsDTO updatedAcademic = studentAcademicsService.updateAcademic(id, academicDTO);
        if (updatedAcademic != null) {
            return ResponseEntity.ok(updatedAcademic);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcademic(@PathVariable Long id) {
        studentAcademicsService.deleteAcademic(id);
        return ResponseEntity.noContent().build();
    }
}
