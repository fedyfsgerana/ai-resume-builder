import PDFDocument from "pdfkit";

export const generatePDF = (resumeData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const { personalInfo, summary, experience, education, skills } = resumeData;

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(personalInfo.name, { align: "center" });

    doc.fontSize(10).font("Helvetica");
    const contacts = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.address,
      personalInfo.linkedin,
      personalInfo.website,
    ]
      .filter(Boolean)
      .join(" | ");

    doc.text(contacts, { align: "center" });
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    if (summary) {
      doc.fontSize(12).font("Helvetica-Bold").text("SUMMARY");
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica").text(summary);
      doc.moveDown();
    }

    if (experience && experience.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").text("EXPERIENCE");
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      experience.forEach((exp) => {
        doc.fontSize(11).font("Helvetica-Bold").text(exp.position);
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `${exp.company} | ${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}`,
          );
        if (exp.description && exp.description.length > 0) {
          exp.description.forEach((desc) => {
            doc.text(`- ${desc}`);
          });
        }
        doc.moveDown(0.5);
      });
    }

    if (education && education.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").text("EDUCATION");
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      education.forEach((edu) => {
        doc.fontSize(11).font("Helvetica-Bold").text(edu.institution);
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `${edu.degree}${edu.field ? " - " + edu.field : ""} | ${edu.startDate} - ${edu.endDate || "Present"}`,
          );
        if (edu.gpa) doc.text(`GPA: ${edu.gpa}`);
        doc.moveDown(0.5);
      });
    }

    if (skills && skills.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").text("SKILLS");
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica").text(skills.join(", "));
    }

    doc.end();
  });
};
