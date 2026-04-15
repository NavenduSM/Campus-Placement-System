package com.example.Student_Service.service;

import com.example.Student_Service.dto.StudentDTO;
import com.example.Student_Service.entity.Student;
import com.example.Student_Service.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Value("${app.upload.dir:${user.home}/uploads/resumes}")
    private String uploadDir;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StudentDTO> getStudentById(Long id) {
        return studentRepository.findById(id).map(this::convertToDTO);
    }

    public Optional<StudentDTO> getStudentByEnrollmentNumber(String enrollmentNumber) {
        return studentRepository.findByEnrollmentNumber(enrollmentNumber).map(this::convertToDTO);
    }

    public List<StudentDTO> getStudentsByCourses(List<String> courses) {
        if (courses == null || courses.isEmpty()) {
            return List.of();
        }

        Set<String> normalizedCourses = courses.stream()
            .filter(course -> course != null && !course.isBlank())
            .map(course -> course.trim().toLowerCase())
            .collect(Collectors.toSet());

        if (normalizedCourses.isEmpty()) {
            return List.of();
        }

        return studentRepository.findAll().stream()
            .filter(student -> student.getCourse() != null
                && normalizedCourses.contains(student.getCourse().trim().toLowerCase()))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public StudentDTO createStudent(StudentDTO studentDTO, MultipartFile resume) throws IOException {
        if (studentDTO.getEnrollmentNumber() != null
            && studentRepository.existsByEnrollmentNumber(studentDTO.getEnrollmentNumber())) {
            throw new RuntimeException("Profile already created");
        }
        Student student = convertToEntity(studentDTO);
        if (resume != null && !resume.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, resume.getBytes());
            student.setResumePath(filePath.toString());
        }
        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    public StudentDTO updateStudent(Long id, StudentDTO studentDTO, MultipartFile resume) throws IOException {
        Optional<Student> existingStudentOpt = studentRepository.findById(id);
        if (existingStudentOpt.isPresent()) {
            Student existingStudent = existingStudentOpt.get();
            // Update fields
            existingStudent.setName(studentDTO.getName());
            existingStudent.setAge(studentDTO.getAge());
            existingStudent.setEmail(studentDTO.getEmail());
            existingStudent.setEnrollmentNumber(studentDTO.getEnrollmentNumber());
            existingStudent.setCourse(studentDTO.getCourse());
            existingStudent.setCourseSpecialisation(studentDTO.getCourseSpecialisation());
            existingStudent.setPhone(studentDTO.getPhone());
            existingStudent.setAlternatePhone(studentDTO.getAlternatePhone());
            existingStudent.setAddress(studentDTO.getAddress());
            if (resume != null && !resume.isEmpty()) {
                // Delete old resume if exists
                if (existingStudent.getResumePath() != null) {
                    Files.deleteIfExists(Paths.get(existingStudent.getResumePath()));
                }
                String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, resume.getBytes());
                existingStudent.setResumePath(filePath.toString());
            }
            Student updatedStudent = studentRepository.save(existingStudent);
            return convertToDTO(updatedStudent);
        }
        return null;
    }

    public void deleteStudent(Long id) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (student.getResumePath() != null) {
                try {
                    Files.deleteIfExists(Paths.get(student.getResumePath()));
                } catch (IOException e) {
                    // Log error
                }
            }
            studentRepository.deleteById(id);
        }
    }

    private StudentDTO convertToDTO(Student student) {
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
        // Note: Skills, academics, specialCriteria would be set separately or in a combined method
        return dto;
    }

    private Student convertToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setAge(dto.getAge());
        student.setEmail(dto.getEmail());
        student.setEnrollmentNumber(dto.getEnrollmentNumber());
        student.setCourse(dto.getCourse());
        student.setCourseSpecialisation(dto.getCourseSpecialisation());
        student.setPhone(dto.getPhone());
        student.setAlternatePhone(dto.getAlternatePhone());
        student.setAddress(dto.getAddress());
        student.setResumePath(dto.getResumePath());
        return student;
    }
}
