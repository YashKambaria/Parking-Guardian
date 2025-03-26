package net.engineeringdigest.journalApp.Controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthCheck {
	
	@GetMapping("/check")
	public String check() {
		return "working fine";
	}
	
}
