package net.engineeringdigest.journalApp;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JournalApplication {
    public static void main(String[] args) {
        SpringApplication.run(JournalApplication.class, args);
    }


}