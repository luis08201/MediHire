export type JobNarrative = {
  description?: string
  qualifications?: string[]
}

export const jobNarratives: Record<string, JobNarrative> = {
  'med-surg-rn-harborlight': {
    description:
      'A day-shift sample role on Harborlight’s adult medical-surgical unit. The work moves between bedside assessment, medication passes, and discharge teaching for patients who are stable enough to leave the unit with a clear plan.',
    qualifications: [
      'Nursing practice with adult medical-surgical inpatients.',
      'Comfort giving medications and documenting in a shared clinical record.',
      'Experience preparing patients and families for discharge.',
    ],
  },
  'medical-lab-scientist-harborlight': {
    description:
      'An evening contract in Harborlight’s laboratory, supporting inpatient and emergency decisions. The bench covers chemistry and hematology, with quality checks before results move to the care team.',
    qualifications: [
      'Laboratory practice across chemistry and hematology.',
      'Familiarity with quality-control review and instrument readiness.',
      'Ability to cover an evening contract shift.',
    ],
  },
  'ed-rn-northcedar': {
    description:
      'An overnight emergency role at Northcedar Regional Hospital. Arrivals need triage, treatment started from department protocols, and a clear handoff when the patient moves or the shift ends.',
    qualifications: [
      'Emergency nursing practice, including overnight coverage.',
      'Experience triaging arrivals and watching unstable patients.',
      'Clear documentation of assessments, treatments, and handoffs.',
    ],
  },
  'hospital-pharmacist-ridgeway': {
    description:
      'A day-shift pharmacist role at Ridgeway Community Hospital. The work is inpatient order review, preparation workflows, and practical guidance for clinicians when a dose, interaction, or shortage needs a decision.',
    qualifications: [
      'Hospital pharmacy practice with inpatient order verification.',
      'Experience with sterile and non-sterile preparation workflows.',
      'Ability to advise clinicians on dosing and shortages.',
    ],
  },
  'icu-nurse-manager-lakeshore': {
    description:
      'A weekday leadership role for the intensive care unit at Lakeshore University Hospital. The manager keeps staffing, assignments, and follow-up on safety events moving, and stays available when nurses need a practice question answered.',
    qualifications: [
      'Intensive care nursing practice, plus experience leading a unit.',
      'Comfort coordinating staffing and daily assignments.',
      'Experience following quality measures and safety events.',
    ],
  },
  'respiratory-therapist-mesa-verde': {
    description:
      'A rotating-shift respiratory role at Mesa Verde Health. Treatments and ventilator support run across inpatient units, with emergency response when a patient’s breathing changes.',
    qualifications: [
      'Respiratory therapy practice in an acute-care hospital.',
      'Experience with ventilator management and emergency response.',
      'Ability to rotate shifts across inpatient units.',
    ],
  },
  'radiologic-technologist-mesa-verde': {
    description:
      'A part-time day-shift imaging role at Mesa Verde Health. Exams come from the emergency department, inpatient units, and the scheduled list, with a safety screen before each study.',
  },
  'physical-therapist-solace': {
    description:
      'A day-shift pediatric physical therapy role at Solace Children’s Hospital. Evaluations set movement goals with families, and treatment happens both at the bedside and in the therapy gym.',
    qualifications: [
      'Physical therapy practice with infants, children, or adolescents.',
      'Experience setting goals with families and documenting progress.',
      'Comfort working on a pediatric unit and in a therapy gym.',
    ],
  },
  'telehealth-rn-harborlight': {
    description:
      'A part-time remote nursing role for Harborlight’s virtual care team. Evening calls and video visits review discharge instructions and send patients back to in-person care when symptoms need more than a remote check.',
    qualifications: [
      'Registered nursing practice with adult patients after discharge.',
      'Comfort conducting phone and video follow-up.',
      'Judgment about which symptoms need an in-person assessment.',
    ],
  },
  'icu-rn-lakeshore': {
    description:
      'A night-shift bedside role in the intensive care unit at Lakeshore University Hospital. The nurse watches hemodynamics, titrates infusions with the team, and partners with respiratory therapy on ventilator care.',
    qualifications: [
      'Critical care nursing practice with adult patients.',
      'Experience titrating infusions and monitoring hemodynamics.',
      'Ability to work night shift and give a structured handoff.',
    ],
  },
  'case-manager-northcedar': {
    description:
      'A hybrid case-management role at Northcedar Regional Hospital. Three days are on site with the care team, and two are remote, spent arranging the services a patient needs before discharge.',
    qualifications: [
      'Nursing practice in discharge planning or care management.',
      'Experience arranging follow-up services with patients and families.',
      'Ability to split the week between the hospital and remote work.',
    ],
  },
  'ct-technologist-ridgeway': {
    description:
      'A day-shift CT role at Ridgeway Community Hospital. The list mixes scheduled studies and urgent exams, including contrast preparation and a handoff to the radiologist when the study is complete.',
    qualifications: [
      'CT practice in a hospital imaging department.',
      'Experience screening patients and preparing contrast.',
      'Ability to move between scheduled and urgent exams.',
    ],
  },
  'evening-pharmacist-lakeshore': {
    description:
      'A part-time evening pharmacist role at Lakeshore University Hospital. New inpatient and emergency orders need verification before night, and open questions are handed to the morning team.',
    qualifications: [
      'Hospital pharmacy practice on an evening or off-shift schedule.',
      'Experience verifying orders when information is incomplete.',
      'Comfort supporting nursing teams with dosing questions.',
    ],
  },
  'occupational-therapist-solace': {
    description:
      'A contract occupational therapy assignment at Solace Children’s Hospital. Sessions focus on fine-motor skills and self-care, with documentation left ready for the team that continues the child’s care.',
    qualifications: [
      'Occupational therapy practice with pediatric patients.',
      'Experience evaluating fine-motor and self-care needs with families.',
      'Ability to cover a contract assignment on the pediatric unit.',
    ],
  },
  'infection-prevention-harborlight': {
    description:
      'A hybrid quality role at Harborlight Medical Center. Surveillance and cluster follow-up can be done away from the units, while three weekdays are spent rounding with unit leaders on prevention practice.',
    qualifications: [
      'Infection prevention or hospital quality practice.',
      'Experience reviewing surveillance data and following clusters.',
      'Ability to work a hybrid week with on-site rounding.',
    ],
  },
  'inpatient-coder-mesa-verde': {
    description:
      'A remote contract coding role for Mesa Verde Health. Inpatient records are reviewed from a home workspace, and a query goes back to the clinician when the documentation cannot support a code.',
    qualifications: [
      'Inpatient coding practice from a remote workspace.',
      'Experience querying clinicians when documentation is incomplete.',
      'Ability to keep a contract coding queue moving.',
    ],
  },
  'or-nurse-lakeshore': {
    description:
      'A day-shift operating room role at Lakeshore University Hospital. The nurse prepares the room, circulates or scrubs for scheduled cases, and stays with the count until the patient reaches recovery.',
    qualifications: [
      'Perioperative nursing practice in a hospital operating room.',
      'Experience circulating or scrubbing for scheduled cases.',
      'Comfort with sterile-field counts and case documentation.',
    ],
  },
  'respiratory-therapist-nights-mesa-verde': {
    qualifications: [
      'Respiratory therapy practice on a night shift.',
      'Experience covering inpatient treatments and emergency calls.',
      'Ability to report unfinished work to the day team.',
    ],
  },
}
