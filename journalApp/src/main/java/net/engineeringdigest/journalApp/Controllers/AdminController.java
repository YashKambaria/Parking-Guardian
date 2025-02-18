package net.engineeringdigest.journalApp.Controllers;


import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
	
	
	@Autowired
	public UserService userService;
	
	@GetMapping("/get-all")
	public ResponseEntity<?> get(){
		List<UserEntity> users=userService.getAll();
		if(users.isEmpty() || users!=null){
			return new ResponseEntity<>(users, HttpStatus.OK);
		}
		else{
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
}
