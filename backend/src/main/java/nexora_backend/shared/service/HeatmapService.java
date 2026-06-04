package nexora_backend.shared.service;

import nexora_backend.shared.dto.HeatmapZone;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HeatmapService {
    
    private final JdbcTemplate jdbcTemplate;
    
    public HeatmapService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public List<HeatmapZone> getDisasterHeatmap() {
        String sql = """
            SELECT 
                COALESCE(cr.area, fa.area) as area,
                COALESCE(cr.city, fa.city) as city,
                COALESCE(cr.latitude, fa.latitude) as latitude,
                COALESCE(cr.longitude, fa.longitude) as longitude,
                COUNT(*) as report_count,
                CASE 
                    WHEN COUNT(*) >= 50 THEN 'CRITICAL'
                    WHEN COUNT(*) >= 10 THEN 'HIGH'
                    WHEN COUNT(*) >= 5 THEN 'MEDIUM'
                    ELSE 'LOW'
                END as intensity,
                LEAST(COUNT(*) / 100.0, 1.0) as severity_score
            FROM (
                SELECT area, city, latitude, longitude, created_at FROM citizen_report
                UNION ALL
                SELECT area, city, latitude, longitude, entry_date as created_at FROM sos_report
            ) as cr
            WHERE cr.created_at > NOW() - INTERVAL '7 days'
            GROUP BY area, city, latitude, longitude
            HAVING COUNT(*) >= 1
            ORDER BY report_count DESC
        """;
        
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            HeatmapZone.builder()
                .latitude(rs.getDouble("latitude"))
                .longitude(rs.getDouble("longitude"))
                .intensity(rs.getString("intensity"))
                .reportCount(rs.getInt("report_count"))
                .area(rs.getString("area"))
                .city(rs.getString("city"))
                .severityScore(rs.getDouble("severity_score"))
                .build()
        );
    }
    
    public List<HeatmapZone> getTaskHeatmap(String responderUsername) {
        String sql = """
            SELECT 
                dt.latitude, dt.longitude,
                COUNT(*) as task_count,
                CASE 
                    WHEN COUNT(*) >= 20 THEN 'CRITICAL'
                    WHEN COUNT(*) >= 10 THEN 'HIGH'
                    WHEN COUNT(*) >= 5 THEN 'MEDIUM'
                    ELSE 'LOW'
                END as intensity
            FROM department_task dt
            LEFT JOIN citizen_report cr ON dt.report_id = cr.id
            WHERE dt.responder_username = ?
            AND dt.status IN ('PENDING_RESPONDER', 'ACCEPTED', 'IN_PROGRESS')
            AND dt.created_at > NOW() - INTERVAL '30 days'
            GROUP BY dt.latitude, dt.longitude
        """;
        
        return jdbcTemplate.query(sql, new Object[]{responderUsername}, (rs, rowNum) ->
            HeatmapZone.builder()
                .latitude(rs.getDouble("latitude"))
                .longitude(rs.getDouble("longitude"))
                .intensity(rs.getString("intensity"))
                .reportCount(rs.getInt("task_count"))
                .build()
        );
    }
}
