package com.foodie.service;
import com.foodie.dto.TrackingUpdate;
import com.foodie.repository.OrderRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TrackingService {
    private final SimpMessagingTemplate ws;
    private final OrderRepository orderRepo;

    public TrackingService(SimpMessagingTemplate ws, OrderRepository orderRepo) {
        this.ws=ws; this.orderRepo=orderRepo;
    }

    public void process(TrackingUpdate u) {
        orderRepo.findById(u.getOrderId()).ifPresent(o -> {
            double dLat = o.getDeliveryLat()!=0?o.getDeliveryLat():48.1351;
            double dLng = o.getDeliveryLng()!=0?o.getDeliveryLng():11.5820;
            int eta = (int) Math.ceil(haversine(u.getLat(),u.getLng(),dLat,dLng)/25.0*60);
            u.setEstimatedDelivery(eta<=1?"Arriving now":"~"+eta+" min");
            if (u.getStatus()!=null && !u.getStatus().isBlank()) {
                o.setStatus(u.getStatus());
                if ("DELIVERED".equals(u.getStatus())) o.setEstimatedDelivery("Delivered");
                orderRepo.save(o);
            }
        });
        ws.convertAndSend("/topic/tracking/"+u.getOrderId(), u);
    }

    private double haversine(double lat1,double lon1,double lat2,double lon2) {
        double R=6371, dLat=Math.toRadians(lat2-lat1), dLon=Math.toRadians(lon2-lon1);
        double a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);
        return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    }
}
