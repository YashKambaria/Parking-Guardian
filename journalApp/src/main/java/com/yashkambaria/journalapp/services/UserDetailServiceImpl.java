package com.yashkambaria.journalapp.services;


import com.yashkambaria.journalapp.Entities.UserEntity;
import com.yashkambaria.journalapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepositary;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserEntity user = userRepositary.findByUsername(username);
		if(user!=null){
			UserDetails userdetails = org.springframework.security.core.userdetails.User.builder().
					username(user.getUsername())
					.password(user.getPassword())
					.roles(user.getRoles().toArray(new String[0]))
					.build();
			return userdetails;
		}
		throw new UsernameNotFoundException("User not found with username");
	}
}
