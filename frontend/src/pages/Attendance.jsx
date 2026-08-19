import React, { useEffect, useState } from "react";
import { getMyAttendance } from "../api";

export default function Attendance() {

  const [attendanceData, setAttendanceData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    async function loadAttendance() {

      try {

        setLoading(true);
        setError("");

        const data = await getMyAttendance();

        setAttendanceData(data);

      } catch (err) {

        console.error(
          "Attendance error:",
          err
        );

        setError(
          err.message ||
          "Unable to load attendance"
        );

      } finally {

        setLoading(false);

      }
    }

    loadAttendance();

  }, []);

  const totalAttended =
    attendanceData.reduce(
      (sum, item) =>
        sum + (item.attended || 0),
      0
    );

  const totalClasses =
    attendanceData.reduce(
      (sum, item) =>
        sum + (item.total || 0),
      0
    );

  const overallPercentage =
    totalClasses > 0
      ? (
          (totalAttended / totalClasses) *
          100
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <section className="page-section">

        <div className="page-loading">
          Loading attendance...
        </div>

      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section">

        <div className="page-error">
          {error}
        </div>

      </section>
    );
  }

  return (
    <section className="page-section">

      <div className="page-heading">

        <div>

          <span className="page-eyebrow">
            Academic
          </span>

          <h1>
            Attendance
          </h1>

          <p>
            Keep track of your subject-wise
            attendance.
          </p>

        </div>

        <div className="attendance-summary">

          <strong>
            {overallPercentage}%
          </strong>

          <span>
            Overall Attendance
          </span>

        </div>

      </div>

      {attendanceData.length === 0 ? (

        <div className="page-empty">

          <span>
            📊
          </span>

          <h2>
            No attendance records
          </h2>

          <p>
            Attendance information has not been
            added yet.
          </p>

        </div>

      ) : (

        <div className="attendance-grid">

          {attendanceData.map((item) => {

            const percentage =
              item.total > 0
                ? (
                    (item.attended /
                      item.total) *
                    100
                  ).toFixed(1)
                : "0.0";

            return (
              <div
                className="attendance-card"
                key={item.id}
              >

                <div className="attendance-card-top">

                  <h2>
                    {item.subject}
                  </h2>

                  <span
                    className={
                      Number(percentage) >= 75
                        ? "attendance-good"
                        : "attendance-low"
                    }
                  >
                    {percentage}%
                  </span>

                </div>

                <div className="attendance-bar">

                  <div
                    className="attendance-progress"
                    style={{
                      width:
                        `${Math.min(
                          Number(percentage),
                          100
                        )}%`,
                    }}
                  />

                </div>

                <div className="attendance-info">

                  <span>
                    {item.attended} attended
                  </span>

                  <span>
                    {item.total} classes
                  </span>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}