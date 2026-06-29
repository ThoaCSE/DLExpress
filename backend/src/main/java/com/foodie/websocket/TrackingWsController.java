package com.foodie.websocket;
import com.foodie.dto.TrackingUpdate;
import com.foodie.service.TrackingService;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

@Controller
public class TrackingWsController {
    private final TrackingService svc;
    public TrackingWsController(TrackingService s){svc=s;}
    @MessageMapping("/tracking/update")
    public void handle(@Payload TrackingUpdate u){ svc.process(u); }
}
