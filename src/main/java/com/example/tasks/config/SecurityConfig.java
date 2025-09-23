package com.example.tasks.config;

import com.example.tasks.security.JwtAuthenticationFilter;
import com.example.tasks.security.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.withUsername("admin")
                .password(encoder.encode("admin123"))
                .roles("ADMIN")
                .build();
        UserDetails user = User.withUsername("user")
                .password(encoder.encode("user123"))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin, user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService uds, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(encoder);
        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain filterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http,
                                           JwtProvider jwtProvider,
                                           UserDetailsService uds) throws Exception {
        // 1. 纯 API：关 CSRF、Session 改无状态
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(mgr -> mgr.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 2. 授权规则
        http.authorizeHttpRequests(registry -> registry
                .requestMatchers("/api/auth/**", "/api/health", "/h2-console/**").permitAll() // 登录 & 健康检查 & H2 控制台放行
                .anyRequest().authenticated()
        );

        // 3. H2 控制台需要的 Frame 允许（开发期）
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        // 4. 加入 JWT 过滤器（在用户名密码过滤器之前）
        http.addFilterBefore(new JwtAuthenticationFilter(jwtProvider, uds),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
