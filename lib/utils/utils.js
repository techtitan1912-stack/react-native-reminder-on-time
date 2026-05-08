//This function converted the createdAt to this format : "15 May 2026"

export function formatDate(dateString) {
    if (!dateString) return null;
    
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return null; // agar invalid hai to null


    const date = new Date(dateString);
    const month = date.toLocaleDateString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
    return `${day} ${month} ${year}, ${time}`
}
export function formatDateOnly(dateString) {
     if (!dateString) return null;
    
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return null; // agar invalid hai to null


    const date = new Date(dateString);
    const month = date.toLocaleDateString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`
}