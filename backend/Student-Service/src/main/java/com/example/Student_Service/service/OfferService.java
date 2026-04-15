package com.example.Student_Service.service;

import com.example.Student_Service.entity.Offer;
import com.example.Student_Service.entity.Student;
import com.example.Student_Service.repository.OfferRepository;
import com.example.Student_Service.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public Optional<Offer> getOfferById(Long id) {
        return offerRepository.findById(id);
    }

    public List<Offer> getOffersByStudentId(Long studentId) {
        return offerRepository.findByStudentId(studentId);
    }

    public List<Offer> getOffersByEnrollmentNo(String enrollmentNo) {
        Student student = studentRepository.findByEnrollmentNumber(enrollmentNo)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return offerRepository.findByStudentId(student.getId());
    }

    public Offer saveOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public Offer updateOffer(Long id, Offer offerDetails) {
        Optional<Offer> existingOfferOpt = offerRepository.findById(id);
        if (existingOfferOpt.isPresent()) {
            Offer existingOffer = existingOfferOpt.get();
            existingOffer.setStudentId(offerDetails.getStudentId());
            existingOffer.setCompanyName(offerDetails.getCompanyName());
            existingOffer.setOfferDetails(offerDetails.getOfferDetails());
            existingOffer.setOfferPdfPath(offerDetails.getOfferPdfPath());
            existingOffer.setGeneratedDate(offerDetails.getGeneratedDate());
            return offerRepository.save(existingOffer);
        }
        return null;
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }
}
