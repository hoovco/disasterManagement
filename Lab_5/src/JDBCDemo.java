import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo {
    public static void main(String[] args) {
        Connection conn;
        Statement stmt;
        try {
            // load the JDBC driver
            Class.forName("org.postgresql.Driver");

            // establish connection
            String url = "jdbc:postgresql://localhost:5432/disastermgnt";
            conn = DriverManager.getConnection(url, "postgres", "admin");

            // query the database
            String sql = "\tselect donation_report.report_id, report_type, donation_report.resource_type, person.first_name, disaster_type, time_stamp, ST_AsText(report.geom) as geom \n" +
                    "from report\n" +
                    "inner join donation_report on donation_report.report_id = report.id\n" +
                    "inner join person on person.id = report.reportor_id;\n";
            stmt = conn.createStatement();
            ResultSet res = stmt.executeQuery(sql);

            // print the result
            if (res != null) {
                while (res.next()) {
                    System.out.println("id: " + res.getString("report_id"));
                    System.out.println("first_name: " + res.getString("first_name"));
                    System.out.println("report_type: " + res.getString("report_type"));
                    System.out.println("resource_type: " + res.getString("resource_type"));
                    System.out.println("disaster: " + res.getString("disaster_type"));
                    System.out.println("time_stamp: " + res.getString("time_stamp"));
                    System.out.println("geom: " + res.getString("geom"));
                }
            }

            // clean up
            stmt.close();
            conn.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
