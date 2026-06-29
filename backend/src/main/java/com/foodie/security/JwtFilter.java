package com.foodie.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService uds;
    public JwtFilter(JwtUtil jwtUtil, UserDetailsService uds) { this.jwtUtil=jwtUtil; this.uds=uds; }
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
        throws ServletException, IOException {
        String auth = req.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                String token = auth.substring(7);
                String email = jwtUtil.extractEmail(token);
                if (email!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
                    UserDetails ud = uds.loadUserByUsername(email);
                    if (jwtUtil.validate(token, ud)) {
                        var at = new UsernamePasswordAuthenticationToken(ud,null,ud.getAuthorities());
                        at.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(at);
                    }
                }
            } catch(Exception ignored) {}
        }
        chain.doFilter(req, res);
    }
}
