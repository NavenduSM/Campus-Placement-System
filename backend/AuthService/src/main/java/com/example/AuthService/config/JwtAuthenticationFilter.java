package com.example.AuthService.config;

import com.example.AuthService.service.CustomUserDetailsService;
import com.example.AuthService.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        logger.info("Processing request: {} {}", method, requestURI);

        // Skip JWT processing for permitAll endpoints
        if (isPublicEndpoint(requestURI, method)) {
            logger.info("Public endpoint detected, skipping JWT processing");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.info("No valid Authorization header, proceeding without authentication");
            filterChain.doFilter(request, response);
            return;
        }

        logger.info("Authorization header found");
        jwt = authHeader.substring(7);
        try {
            userEmail = jwtUtil.extractEmailId(jwt);
            logger.info("Extracted email: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);
                if (jwtUtil.isTokenValid(jwt, userDetails.getUsername())) {
                    logger.info("Token valid, setting authentication");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("Token invalid");
                }
            }
        } catch (Exception e) {
            logger.error("Exception in JWT processing", e);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String uri, String method) {
        // Only check POST methods for these endpoints
        if (!"POST".equalsIgnoreCase(method)) {
            return false;
        }

        return uri.endsWith("/api/students/signup") ||
                uri.endsWith("/api/students/verify-otp") ||
                uri.endsWith("/api/students/login") ||
                uri.endsWith("/api/tpo/signup") ||
                uri.endsWith("/api/tpo/verify-otp") ||
                uri.endsWith("/api/tpo/login");
    }
}
