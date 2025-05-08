import { useEffect, useState } from 'react';

export default function LearningRecommendations({ missingSkills, skillsToImprove }) {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const response = await fetch('/api/recommend-learning/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missing_skills: missingSkills, skills_to_improve: skillsToImprove }),
      });

      const data = await response.json();
      setResources(data.resources);
    };

    if (missingSkills.length > 0 || skillsToImprove.length > 0) {
      fetchResources();
    }
  }, [missingSkills, skillsToImprove]);

  return (
    <ul>
      {resources.map((item, idx) => (
        <li key={idx}>
          {item.skill} - <a href={item.resource} target="_blank">{item.resource}</a>
        </li>
      ))}
    </ul>
  );
}
