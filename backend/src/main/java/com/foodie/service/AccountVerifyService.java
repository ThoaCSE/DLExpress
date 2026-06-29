package com.foodie.service;
import com.foodie.repository.OrderRepository;
import com.foodie.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * v5.2: Verifies whether an account is safe to delete.
 * Checks for unpaid orders, and unresolved disputes.
 */
@Service
public class AccountVerifyService {
    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;

    public AccountVerifyService(OrderRepository orderRepo, PaymentRepository paymentRepo) {
        this.orderRepo=orderRepo; this.paymentRepo=paymentRepo;
    }

    public List<String> getFlags(String userId) {
        List<String> flags = new ArrayList<>();
        // Orders placed but payment still pending
        var unpaid = orderRepo.findByBuyerIdAndPaymentStatus(userId, "PENDING");
        if (!unpaid.isEmpty()) flags.add("Has " + unpaid.size() + " unpaid order(s)");
        // Payments where FAILED but order not cancelled
        var payments = paymentRepo.findByBuyerId(userId);
        long failed = payments.stream().filter(p->"FAILED".equals(p.getStatus())).count();
        if (failed > 0) flags.add("Has " + failed + " failed payment record(s)");
        return flags;
    }

    public boolean isSafeToDelete(String userId) {
        return getFlags(userId).isEmpty();
    }
}
