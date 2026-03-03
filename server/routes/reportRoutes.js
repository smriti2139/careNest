import express from "express";
import PDFDocument from "pdfkit";
import jwt from "jsonwebtoken";
import Child from "../models/Child.js";
import Vaccination from "../models/Vaccination.js";
import Growth from "../models/Growth.js";

const router = express.Router();

router.get("/:childId", async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const child = await Child.findById(req.params.childId).populate("parentId");

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const vaccines = await Vaccination.find({ childId: child._id });
    const growth = await Growth.find({ childId: child._id });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${child.name}_medical_report.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("Child Medical Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${child.name}`);
    doc.text(`Parent: ${child.parentId?.name || "N/A"}`);
    doc.text(`DOB: ${new Date(child.dob).toDateString()}`);
    doc.text(`Gender: ${child.gender}`);
    doc.text(`Birth Weight: ${child.birthWeight} kg`);
    doc.moveDown();

    doc.text("Vaccination History:");
    if (vaccines.length === 0) {
      doc.text("No vaccination records available.");
    } else {
      vaccines.forEach((v) => {
        doc.text(
          `${v.vaccineName} - ${v.status.toUpperCase()} (Due: ${new Date(
            v.dueDate
          ).toDateString()})`
        );
      });
    }

    doc.moveDown();
    doc.text("Growth Records:");
    if (growth.length === 0) {
      doc.text("No growth records available.");
    } else {
      growth.forEach((g) => {
        doc.text(
          `Height: ${g.height} cm | Weight: ${g.weight} kg | Date: ${new Date(
            g.date
          ).toDateString()}`
        );
      });
    }

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;