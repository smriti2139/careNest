import Child from "../models/Child.js";
import Vaccination from "../models/Vaccination.js";

export const createChild = async (req, res) => {
  try {
    const { name, dob, gender, birthWeight } = req.body;

    const child = await Child.create({
      parentId: req.user._id,
      name,
      dob,
      gender,
      birthWeight,
    });

    // 🧠 Auto Vaccine Logic

    const birthDate = new Date(dob);

    const vaccines = [
      { name: "BCG", weeksAfterBirth: 0 },
      { name: "OPV-1", weeksAfterBirth: 6 },
      { name: "DPT-1", weeksAfterBirth: 6 },
      { name: "Hepatitis B", weeksAfterBirth: 6 },
      { name: "MMR", weeksAfterBirth: 36 },
    ];

    const vaccineRecords = vaccines.map(vaccine => {
      const due = new Date(birthDate);
      due.setDate(due.getDate() + vaccine.weeksAfterBirth * 7);

      return {
        childId: child._id,
        vaccineName: vaccine.name,
        dueDate: due,
      };
    });

    await Vaccination.insertMany(vaccineRecords);

    res.status(201).json({
      message: "Child created & vaccine schedule generated",
      child,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};