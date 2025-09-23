import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfileCompletionPage = () => {
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const studentData = {
      StudentID: studentId,
      full_name: fullName,
      course,
      section,
      year_level: yearLevel,
      email: user.email,
      contact_number: contactNumber,
    };

    // ✅ Save to DB
    await fetch("/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });

    // ✅ Update localStorage with full profile
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...user, ...studentData })
    );

    navigate("/student");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <Input
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
      />
      <Input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        required
      />
      <Input
        placeholder="Section"
        value={section}
        onChange={(e) => setSection(e.target.value)}
        required
      />
      <Input
        placeholder="Year Level"
        value={yearLevel}
        onChange={(e) => setYearLevel(e.target.value)}
        required
      />
      <Input
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        required
      />
      <Button type="submit" className="w-full gradient-primary">
        Save Profile
      </Button>
    </form>
  );
};

export default ProfileCompletionPage;