package com.example.Student_Service.controller;

import com.example.Student_Service.entity.Offer;
import com.example.Student_Service.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @PostMapping("/receive")
    public ResponseEntity<Offer> receiveOffer(@RequestBody Offer offer) {
        Offer savedOffer = offerService.saveOffer(offer);
        return ResponseEntity.ok(savedOffer);
    }

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

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Offer>> getOffersByStudentId(@PathVariable Long studentId) {
        List<Offer> offers = offerService.getOffersByStudentId(studentId);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/student/enrollment/{enrollmentNo}")
    public ResponseEntity<List<Offer>> getOffersByEnrollmentNo(@PathVariable String enrollmentNo) {
        List<Offer> offers = offerService.getOffersByEnrollmentNo(enrollmentNo);
        return ResponseEntity.ok(offers);
    }


}
