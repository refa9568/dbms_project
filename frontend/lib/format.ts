export function format(date: Date, formatStr: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  switch (formatStr) {
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`
    case "PPP":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    default:
      return date.toISOString()
  }
}
