package com.yashkambaria.journalapp.scheduler;

import lombok.extern.slf4j.Slf4j;
import com.yashkambaria.journalapp.Entities.UserEntity;
import com.yashkambaria.journalapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ComplaintResetScheduler {
	@Autowired
	private UserRepository userRepository;
	
//	@Scheduled(cron = "*/5 * * * * *") // Runs every 5 seconds
	@Scheduled(cron = "0 0 0 1 * ?") // Runs at midnight on the 1st of every month
	public void resetComplaintCounts() {
		List<UserEntity> users = userRepository.findAll();
		for (UserEntity user : users) {
			user.setComplaintsCount(0); // Reset count to 0
		}
		
		userRepository.saveAll(users);
		log.info("✅ All complaint counts reset to 0!");
	}
}
