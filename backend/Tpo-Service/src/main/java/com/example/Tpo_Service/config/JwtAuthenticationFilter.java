package com.example.Tpo_Service.config;

import com.example.Tpo_Service.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String token = header.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String role = jwtUtil.extractRole(token);
        if (role == null) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        if (!role.equals("TPO")) {
            String uri = request.getRequestURI();
            String method = request.getMethod();
            boolean studentSessionRead =
                "STUDENT".equals(role) &&
                "GET".equalsIgnoreCase(method) &&
                uri.startsWith("/api/sessions");
            boolean studentJobsRead =
                "STUDENT".equals(role) &&
                "GET".equalsIgnoreCase(method) &&
                uri.startsWith("/api/jd");
            boolean studentApplicationSend =
                "STUDENT".equals(role) &&
                "POST".equalsIgnoreCase(method) &&
                uri.startsWith("/api/applications/receive");
            boolean studentOfferDownload =
                "STUDENT".equals(role) &&
                "GET".equalsIgnoreCase(method) &&
                uri.matches("^/api/offers/\\d+/download$");
            if (!studentSessionRead && !studentJobsRead && !studentApplicationSend && !studentOfferDownload) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        }

        String subject = jwtUtil.extractSubject(token);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(subject, null, null);
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}
