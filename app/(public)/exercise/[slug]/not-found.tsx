import NotFound from "@/components/shared/NotFound";

export default function ExerciseNotFound() {
  return (
    <NotFound
      title="Exercise not found"
      message="The exercise you are looking for does not exist or has been removed."
      returnText="Browse Exercises"
      returnHref="/exercises"
    />
  );
}
