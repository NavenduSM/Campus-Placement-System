package com.example.Tpo_Service.controller;

import com.example.Tpo_Service.client.StudentServiceClient;
import com.example.Tpo_Service.client.StudentServiceOfferClient;
import com.example.Tpo_Service.dto.StudentDTO;
import com.example.Tpo_Service.entity.Offer;
import com.example.Tpo_Service.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    private StudentServiceOfferClient studentServiceOfferClient;

    @Autowired
    private StudentServiceClient studentServiceClient;

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        List<Offer> offers = offerService.getAllOffers();
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOfferById(@PathVariable Long id) {
        Optional<Offer> offer = offerService.getOfferById(id);
        return offer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Offer> generateOffer(@RequestParam(required = false) String studentId,
                                               @RequestParam(required = false) String enrollmentNo,
                                               @RequestParam String companyName,
                                               @RequestParam String offerDetails,
                                               @RequestParam(value = "offerPdf", required = false) MultipartFile offerPdf) {
        try {
            Long resolvedStudentId = null;
            String effectiveEnrollmentNo = enrollmentNo;

            if (studentId != null && !studentId.isBlank()) {
                try {
                    resolvedStudentId = Long.parseLong(studentId);
                } catch (NumberFormatException ex) {
                    // Backward compatible handling: if caller sends enrollment number in studentId key.
                    effectiveEnrollmentNo = studentId;
                }
            }

            if (resolvedStudentId == null) {
                if (effectiveEnrollmentNo == null || effectiveEnrollmentNo.isBlank()) {
                    return ResponseEntity.badRequest().build();
                }
                StudentDTO student = studentServiceClient.getStudentByEnrollmentNo(effectiveEnrollmentNo);
                if (student == null || student.getId() == null) {
                    return ResponseEntity.badRequest().build();
                }
                resolvedStudentId = student.getId();
            }

            Offer offer = offerService.generateOffer(resolvedStudentId, companyName, offerDetails, offerPdf);
            // Send offer to Student Service via Feign
            studentServiceOfferClient.sendOfferToStudent(offer);
            return ResponseEntity.ok(offer);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Offer> updateOffer(@PathVariable Long id, @RequestBody Offer offerDetails) {
        Offer updatedOffer = offerService.updateOffer(id, offerDetails);
        if (updatedOffer != null) {
            return ResponseEntity.ok(updatedOffer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }
}
