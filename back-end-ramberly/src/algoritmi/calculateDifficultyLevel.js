export function calculateDifficultyLevel(user, distance) {
  const normalize = (value, min, max) => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  // Mappa i valori CHAR(1) dal database ai punteggi
  const activityMap = {
    0: 100, // quasi mai
    2: 70, // 1-2 volte/settimana
    4: 40, // 3-4 volte/settimana
    5: 15, // >5 volte/settimana
  };

  const subjectiveScore = () => {
    const genderScore = user.sesso === "femmina" ? 10 : 5;

    const weightScore = normalize(user.peso, 35, 150);
    const ageScore = normalize(user.eta, 10, 80);

    // Converti eventuali valori numerici in stringa per sicurezza
    const userActivity = user.attivita?.toString() || "0";

    return (
      genderScore * 0.05 +
      weightScore * 0.25 +
      ageScore * 0.4 +
      activityMap[userActivity] * 0.3
    );
  };

  const objectiveScore = () => {
    if (distance < 5) return 15;
    if (distance < 8) return 33;
    if (distance <= 15) return 66;
    return 100;
  };

  const combined = (subjectiveScore() * 0.5 + objectiveScore() * 0.5).toFixed(
    1
  );
  // console.log(combined);

  return {
    level:
      combined <= 40 ? "Facile" : combined <= 60 ? "Intermedio" : "Difficile",
    score: parseFloat(combined), // Convertiamo in numero
  };
}
