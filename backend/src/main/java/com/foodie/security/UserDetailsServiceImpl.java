package com.foodie.security;
import com.foodie.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository repo;
    public UserDetailsServiceImpl(UserRepository repo) { this.repo=repo; }
    @Override
    public UserDetails loadUserByUsername(String email) {
        var u = repo.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Not found: "+email));
        return new User(u.getEmail(), u.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name())));
    }
}
