package com.lusotop.api.notification;

import com.lusotop.api.common.NotFoundException;
import com.lusotop.api.notification.dto.NotificationResponse;
import com.lusotop.api.order.Order;
import com.lusotop.api.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void notifyRechargeDelivered(Order order) {
        create(order, NotificationType.RECHARGE_DELIVERED, "Recarga concluída",
                "A tua recarga de " + order.getPhoneNumber() + " foi concluída com sucesso.");
    }

    public void notifyRechargeFailed(Order order) {
        String suffix = order.isRefunded()
                ? " O valor pago foi reembolsado automaticamente."
                : " A nossa equipa foi notificada.";
        create(order, NotificationType.RECHARGE_FAILED, "Problema na recarga",
                "Não foi possível concluir a recarga de " + order.getPhoneNumber() + "." + suffix);
    }

    private void create(Order order, NotificationType type, String title, String message) {
        if (order.getUser() == null) return;

        Notification notification = new Notification();
        notification.setUser(order.getUser());
        notification.setOrder(order);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> findMine(User user) {
        return notificationRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long countUnread(User user) {
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    public void markRead(Long id, User user) {
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new NotFoundException("NOTIFICATION_NOT_FOUND", "Notificação não encontrada."));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllRead(User user) {
        List<Notification> unread = notificationRepository.findAllByUserIdAndReadFalse(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
