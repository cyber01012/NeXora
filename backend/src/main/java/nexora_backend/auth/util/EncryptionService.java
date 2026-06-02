package nexora_backend.auth.util;

import nexora_backend.auth.config.AuthProperties;
import nexora_backend.auth.exception.AuthErrors;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    private final byte[] keyBytes;
    private final SecureRandom secureRandom = new SecureRandom();

    public EncryptionService(AuthProperties authProperties) {
        String configuredKey = authProperties.getEncryption().getKey();
        this.keyBytes = decodeKey(configuredKey);
        if (keyBytes.length != 32) {
            throw new IllegalStateException("nexora.encryption.key must resolve to 32 bytes (hex or base64)");
        }
    }

    private byte[] decodeKey(String configuredKey) {
        if (configuredKey.matches("^[0-9A-Fa-f]{64}$")) {
            byte[] bytes = new byte[32];
            for (int i = 0; i < 32; i++) {
                bytes[i] = (byte) Integer.parseInt(configuredKey.substring(i * 2, i * 2 + 2), 16);
            }
            return bytes;
        }
        return Base64.getDecoder().decode(configuredKey);
    }

    /**
     * AES-GCM with a random IV. Ciphertext differs on every call — not suitable for DB lookups.
     */
    public String encrypt(String plainText) {
        if (plainText == null) {
            return null;
        }
        return encryptWithIv(plainText, generateRandomIv());
    }

    /**
     * AES-GCM with a deterministic IV derived from the plaintext.
     * Same normalized phone/CNIC always produces the same ciphertext so repository lookups work.
     */
    public String encryptDeterministic(String plainText) {
        if (plainText == null) {
            return null;
        }
        return encryptWithIv(plainText, deriveDeterministicIv(plainText));
    }

    private byte[] generateRandomIv() {
        byte[] iv = new byte[GCM_IV_LENGTH];
        secureRandom.nextBytes(iv);
        return iv;
    }

    private byte[] deriveDeterministicIv(String plainText) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keyBytes, "HmacSHA256"));
            byte[] digest = mac.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            byte[] iv = new byte[GCM_IV_LENGTH];
            System.arraycopy(digest, 0, iv, 0, GCM_IV_LENGTH);
            return iv;
        } catch (Exception ex) {
            throw AuthErrors.encryptionFailed();
        }
    }

    private String encryptWithIv(String plainText, byte[] iv) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(keyBytes, "AES"), new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            ByteBuffer buffer = ByteBuffer.allocate(iv.length + cipherText.length);
            buffer.put(iv);
            buffer.put(cipherText);
            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception ex) {
            throw AuthErrors.encryptionFailed();
        }
    }

    public String decrypt(String encryptedText) {
        if (encryptedText == null) {
            return null;
        }
        try {
            byte[] decoded = Base64.getDecoder().decode(encryptedText);
            ByteBuffer buffer = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[GCM_IV_LENGTH];
            buffer.get(iv);
            byte[] cipherText = new byte[buffer.remaining()];
            buffer.get(cipherText);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(keyBytes, "AES"), new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            return new String(cipher.doFinal(cipherText), StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw AuthErrors.decryptionFailed();
        }
    }
}
