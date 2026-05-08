export const applyFilters = (
  tasks = [],
  selectedFilters = [],
  modalFilters = {}
) => {

  // 🟢 If All selected
  if (selectedFilters.includes("All")) {
    return tasks;
  }

  return tasks.filter(task => {

    let keep = true;

    // ✅ Mention Filter
    if (selectedFilters.includes("Mention")) {

      if (
        !task.mentionNumber ||
        task.mentionNumber.length === 0
      ) {
        keep = false;
      }
    }

    // ✅ Pending Filter
    if (selectedFilters.includes("Pending")) {

      if (task.isCompleted === true) {
        keep = false;
      }
    }

    // ✅ Complete Filter
    if (selectedFilters.includes("Complete")) {

      if (task.isCompleted !== true) {
        keep = false;
      }
    }

    // ✅ Today Filter
    if (selectedFilters.includes("Today")) {

      const today =
        new Date().toDateString();

      const taskDate =
        new Date(
          task.reminderTime
        ).toDateString();

      if (taskDate !== today) {
        keep = false;
      }
    }

    // ==========================
    // MODAL FILTERS
    // ==========================

    // Completed
    if (modalFilters.completed) {

      if (!task.isCompleted) {
        keep = false;
      }
    }

    // Mentioned
    if (modalFilters.mentioned) {

      if (
        !task.mentionNumber ||
        task.mentionNumber.length === 0
      ) {
        keep = false;
      }
    }

    // Today
    if (modalFilters.today) {

      const today = new Date();

      const taskDate = new Date(task.reminderTime);

      if (
        today.getFullYear() !== taskDate.getFullYear() ||
        today.getMonth() !== taskDate.getMonth() ||
        today.getDate() !== taskDate.getDate()
      ) {
        keep = false;
      }
    }

    return keep;

  });

};