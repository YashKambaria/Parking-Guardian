package net.engineeringdigest.journalApp.config;

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
				registry.addMapping("/**") // Apply CORS to all endpoints
						.allowedOrigins("http://localhost:5173") // Allow frontend origin
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow necessary HTTP methods
						.allowedHeaders("*") // Allow all headers
						.allowCredentials(true) // Allow credentials like cookies or JWT
						.maxAge(3600); // Cache preflight response for 1 hour
			}
		};
	}
}