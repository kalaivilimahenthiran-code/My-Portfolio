import { NextResponse } from "next/server";
import { addSkill } from "@/services/skillService";

const skills = [
  // Frontend Development
  { name: "HTML5", category: "Frontend Development", level: 90 },
  { name: "CSS3", category: "Frontend Development", level: 85 },
  { name: "JavaScript (ES6+)", category: "Frontend Development", level: 90 },
  { name: "TypeScript", category: "Frontend Development", level: 80 },
  { name: "React.js", category: "Frontend Development", level: 85 },
  { name: "Next.js", category: "Frontend Development", level: 80 },
  
  // Backend Development
  { name: "Node.js", category: "Backend Development", level: 75 },
  { name: "Express.js", category: "Backend Development", level: 75 },
  { name: "Firebase", category: "Backend Development", level: 70 },
  { name: "MongoDB", category: "Backend Development", level: 70 },
  { name: "MySQL", category: "Backend Development", level: 65 },
  
  // Tools & Platforms
  { name: "Git & GitHub", category: "Tools & Platforms", level: 85 },
  { name: "VS Code", category: "Tools & Platforms", level: 90 },
  { name: "Postman", category: "Tools & Platforms", level: 75 },
  
  // Programming Languages
  { name: "JavaScript", category: "Programming Languages", level: 90 },
  { name: "TypeScript", category: "Programming Languages", level: 80 },
  { name: "Python", category: "Programming Languages", level: 70 },
  { name: "Java", category: "Programming Languages", level: 65 },
  
  // UI/UX & Design
  { name: "Responsive Web Design", category: "UI/UX & Design", level: 85 },
  { name: "Mobile-First Design", category: "UI/UX & Design", level: 80 },
  { name: "Framer Motion", category: "UI/UX & Design", level: 75 },
];

export async function POST() {
  const results = [];
  
  for (const skill of skills) {
    try {
      const id = await addSkill(skill);
      results.push({ success: true, skill: skill.name, id });
    } catch (error) {
      results.push({ success: false, skill: skill.name, error: error.message });
    }
  }
  
  return NextResponse.json({
    message: "Skills seeding completed",
    results,
    total: skills.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
  });
}
