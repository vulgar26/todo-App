package com.example.tasks.config;

import java.time.Duration;
import java.util.HashMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.*;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.*;
import org.springframework.cache.interceptor.CacheErrorHandler;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory cf, ObjectMapper mapper) {
        var json = new GenericJackson2JsonRedisSerializer(mapper);

        var defaultCfg = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(json))
                .entryTtl(Duration.ofMinutes(10));

        var perCache = new HashMap<String, RedisCacheConfiguration>();

        perCache.put("tasks", defaultCfg.entryTtl(Duration.ofMinutes(10)));

        return RedisCacheManager.builder(cf)
                .cacheDefaults(defaultCfg)
                .withInitialCacheConfigurations(perCache)
                .build();
    }

    @Bean
    public CacheErrorHandler cacheErrorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {

            }

            @Override
            public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {

            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {

            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {

            }
        };
    }
}
