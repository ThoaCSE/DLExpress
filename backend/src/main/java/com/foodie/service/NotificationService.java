package com.foodie.service;
import com.foodie.entity.Notification;
import com.foodie.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repo;
    private final SimpMessagingTemplate ws;

    public NotificationService(NotificationRepository repo, SimpMessagingTemplate ws) {
        this.repo=repo; this.ws=ws;
    }

    public void send(String userId, String title, String message, String type, String refId) {
        Notification n = Notification.builder().userId(userId).title(title).message(message).type(type).referenceId(refId).build();
        repo.save(n);
        try { ws.convertAndSend("/topic/notifications/"+userId, n); } catch(Exception ignored) {}
    }

    public List<Notification> getForUser(String userId) { return repo.findByUserIdOrderByCreatedAtDesc(userId); }
    public long countUnread(String userId) { return repo.countByUserIdAndRead(userId, false); }
    public void markRead(String id) { repo.findById(id).ifPresent(n->{n.setRead(true);repo.save(n);}); }
    public void markAllRead(String userId) {
        var list = repo.findByUserIdOrderByCreatedAtDesc(userId);
        list.forEach(n->n.setRead(true));
        repo.saveAll(list);
    }
    public List<Notification> getAll() { return repo.findAllByOrderByCreatedAtDesc(); }
}
