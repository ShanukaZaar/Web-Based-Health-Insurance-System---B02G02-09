package com.mlbb2g209.healthinsurance.support;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupportRepository extends JpaRepository<SupportTicket, Long> {

    Optional<SupportTicket> findByTicketNumber(String ticketNumber);

    List<SupportTicket> findByUser_Id(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SupportTicket s WHERE s.user.id = :userId")
    List<SupportTicket> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    List<SupportTicket> findByStatus(String status);

    List<SupportTicket> findByPriority(String priority);

    boolean existsByTicketNumber(String ticketNumber);
}
