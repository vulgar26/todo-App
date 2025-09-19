package com.example.tasks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")                            // 只放开 API 前缀
                        .allowedOrigins("http://localhost:3001")          // 你的前端开发地址
                        .allowedMethods("GET","POST","PATCH","DELETE","OPTIONS")
                        .allowedHeaders("*")                              // 允许任何请求头
                        .allowCredentials(true);                          // 如果需要 cookie/凭证
            }
        };
    }
}