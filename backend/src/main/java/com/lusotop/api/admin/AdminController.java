package com.lusotop.api.admin;

import com.lusotop.api.admin.dto.AdminCustomerResponse;
import com.lusotop.api.admin.dto.AdminDashboardResponse;
import com.lusotop.api.admin.dto.AdminOrderResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/orders")
    public List<AdminOrderResponse> orders() {
        return adminService.orders();
    }

    @GetMapping("/customers")
    public List<AdminCustomerResponse> customers() {
        return adminService.customers();
    }
}
