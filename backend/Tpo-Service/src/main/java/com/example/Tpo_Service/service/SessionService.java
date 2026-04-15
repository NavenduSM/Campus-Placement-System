package com.example.Tpo_Service.service;

import com.example.Tpo_Service.entity.Session;
import com.example.Tpo_Service.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Optional<Session> getSessionById(Long id) {
        return sessionRepository.findById(id);
    }

    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }

    public Session updateSession(Long id, Session sessionDetails) {
        Optional<Session> existingSessionOpt = sessionRepository.findById(id);
        if (existingSessionOpt.isPresent()) {
            Session existingSession = existingSessionOpt.get();
            existingSession.setCompanyName(sessionDetails.getCompanyName());
            existingSession.setScheduledOn(sessionDetails.getScheduledOn());
            existingSession.setStartsAt(sessionDetails.getStartsAt());
            existingSession.setJoinUrl(sessionDetails.getJoinUrl());
            return sessionRepository.save(existingSession);
        }
        return null;
    }

    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }
}
