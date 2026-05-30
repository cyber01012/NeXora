package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final nexora_backend.auth.config.AuthProperties authProperties;

    public void sendOtpEmail(String to, String otp, String purposeLabel) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(authProperties.getMail().getFrom());
        message.setTo(to);
        message.setSubject("NeXora " + purposeLabel + " OTP");
        message.setText("Your OTP is: " + otp + "\n\nThis code expires in 10 minutes.");
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(authProperties.getMail().getFrom());
        message.setTo(to);
        message.setSubject("Welcome to NeXora");
        message.setText("Hello " + name + ",\n\nYour NeXora account has been created successfully.");
        mailSender.send(message);
    }

    public void sendPasswordResetOtpEmail(String to, String otp) {
        sendOtpEmail(to, otp, "Password Reset");
    }

    public void sendPasswordChangedNotification(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(authProperties.getMail().getFrom());
        message.setTo(to);
        message.setSubject("NeXora Security Notice");
        message.setText("Your password was changed successfully.");
        mailSender.send(message);
    }
}
