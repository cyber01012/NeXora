package nexora_backend.database.repository;

import nexora_backend.database.entity.HelpDeskMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HelpDeskMessageRepository extends JpaRepository<HelpDeskMessage, Long> {
    List<HelpDeskMessage> findByReceiverUsernameOrderByCreatedAtAsc(String receiverUsername);
    List<HelpDeskMessage> findBySenderUsernameAndReceiverUsernameOrderByCreatedAtAsc(String sender, String receiver);
}