package com.example.Student_Service.service;

import com.example.Student_Service.dto.StudentSkillsDTO;
import com.example.Student_Service.entity.Student;
import com.example.Student_Service.entity.StudentSkills;
import com.example.Student_Service.repository.StudentRepository;
import com.example.Student_Service.repository.StudentSkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentSkillsService {

    @Autowired
    private StudentSkillsRepository studentSkillsRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentSkillsDTO> getAllSkills() {
        return studentSkillsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StudentSkillsDTO> getSkillsByStudentId(Long studentId) {
        return studentSkillsRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StudentSkillsDTO> getSkillById(Long id) {
        return studentSkillsRepository.findById(id).map(this::convertToDTO);
    }

    public StudentSkillsDTO createSkill(StudentSkillsDTO skillDTO) {
        StudentSkills skill = convertToEntity(skillDTO);
        StudentSkills savedSkill = studentSkillsRepository.save(skill);
        return convertToDTO(savedSkill);
    }

    public StudentSkillsDTO updateSkill(Long id, StudentSkillsDTO skillDTO) {
        Optional<StudentSkills> existingSkillOpt = studentSkillsRepository.findById(id);
        if (existingSkillOpt.isPresent()) {
            StudentSkills existingSkill = existingSkillOpt.get();
            existingSkill.setSkill(skillDTO.getSkill());
            if (skillDTO.getStudentId() != null) {
                Optional<Student> studentOpt = studentRepository.findById(skillDTO.getStudentId());
                studentOpt.ifPresent(existingSkill::setStudent);
            }
            StudentSkills updatedSkill = studentSkillsRepository.save(existingSkill);
            return convertToDTO(updatedSkill);
        }
        return null;
    }

    public void deleteSkill(Long id) {
        studentSkillsRepository.deleteById(id);
    }

    private StudentSkillsDTO convertToDTO(StudentSkills skill) {
        StudentSkillsDTO dto = new StudentSkillsDTO();
        dto.setId(skill.getId());
        dto.setStudentId(skill.getStudent().getId());
        dto.setSkill(skill.getSkill());
        return dto;
    }

    private StudentSkills convertToEntity(StudentSkillsDTO dto) {
        StudentSkills skill = new StudentSkills();
        skill.setId(dto.getId());
        skill.setSkill(dto.getSkill());
        if (dto.getStudentId() != null) {
            Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
            studentOpt.ifPresent(skill::setStudent);
        }
        return skill;
    }
}
