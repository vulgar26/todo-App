package com.example.tasks.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.slf4j.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class RequestLogConfig {
    private static final Logger log = LoggerFactory.getLogger("HTTP");

    @Bean
    public OncePerRequestFilter accessLogFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest req, HttpServletResponse resp, FilterChain chain)
                    throws ServletException, IOException {
                long start = System.currentTimeMillis();
                try {
                    chain.doFilter(req, resp);
                } finally {
                    long cost = System.currentTimeMillis() - start;
                    log.info("{} {} -> {} ({} ms}",
                            req.getMethod(), req.getRequestURI(), resp.getStatus(), cost);
                }
            }
        };
    }
}
