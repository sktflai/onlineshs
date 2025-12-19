const lessons = {

  // 1. Oral Communication in Context
  oralComm: {
    title: "Oral Communication in Context",
    lesson: `
Oral Communication is the process of expressing ideas, information, and feelings through spoken language. It is essential in school, work, and everyday interactions.

COMMUNICATION PROCESS
- Sender: person delivering the message
- Message: the idea or information conveyed
- Channel: the medium used (face-to-face, phone, online)
- Receiver: the listener or audience
- Feedback: the response from the receiver
- Noise: anything that disrupts communication

TYPES OF ORAL COMMUNICATION
1. Interpersonal – one-on-one conversation
2. Group Communication – discussions within small groups
3. Public Speaking – formal speech delivered to an audience

EFFECTIVE ORAL COMMUNICATION SKILLS
- Clarity: speak clearly
- Organization: arrange ideas logically
- Tone: adjust voice to match message
- Body Language: gestures, posture, facial expressions
- Active Listening: focus fully on the speaker

EXAMPLES:
- Introducing yourself in class
- Presenting a report
- Explaining a procedure step-by-step
`,
    summary: `
• Oral communication conveys ideas and feelings  
• Elements: sender, message, channel, receiver, feedback  
• Effective speakers are clear, organized, confident  
• Context affects message delivery
`,
    video: "https://www.youtube.com/results?search_query=oral+communication+in+context+grade+11",
    quiz: [
      {
        question: "Which element receives the message?",
        choices: ["Sender", "Channel", "Receiver", "Noise"],
        answer: 2,
        explanation: "The receiver is the person who listens to or receives the message."
      }
    ]
  },

  // 2. Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino
  kompAtPan: {
    title: "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
    lesson: `
Ang asignaturang ito ay nakatuon sa mabisang komunikasyon sa wikang Filipino at sa pananaliksik na may kaugnayan sa kulturang Pilipino.

WIKA AT KOMUNIKASYON
- Ang wika ay kasangkapan sa pagpapahayag ng kaisipan, damdamin, at karanasan.
- Ginagamit sa pakikipag-usap, pagsulat, pananaliksik, at pagpapahayag ng kultura.

PANANALIKSIK
- Sistematikong pag-aaral upang makakuha ng bagong kaalaman.
- Mga hakbang:
  1. Pagpili ng paksa
  2. Pagbuo ng layunin
  3. Pangangalap ng datos
  4. Pagsusuri ng impormasyon
  5. Pagsulat ng pananaliksik

KULTURANG PILIPINO
- Sinasalamin ng wika ang tradisyon, paniniwala, at pagpapahalaga ng Pilipino.

EXAMPLES:
- Pagsulat ng research paper sa Filipino
- Panayam sa lokal na pamayanan
`,
    summary: `
• Wika ay salamin ng kultura  
• Pananaliksik ay sistematikong pag-aaral  
• Mahalaga ang Filipino sa akademikong diskurso
`,
    video: "https://www.youtube.com/results?search_query=komunikasyon+at+pananaliksik+grade+11",
    quiz: [
      {
        question: "Ano ang unang hakbang sa pananaliksik?",
        choices: ["Pagsusuri", "Pagpili ng paksa", "Pagsulat", "Paglalathala"],
        answer: 1,
        explanation: "Nagsisimula ang pananaliksik sa pagpili ng angkop na paksa."
      }
    ]
  },

  // 3. General Mathematics
  genMath: {
    title: "General Mathematics",
    lesson: `
General Mathematics introduces fundamental mathematical concepts needed for real-life applications.

FUNCTIONS
- A function is a relation where each input has exactly one output.
- Domain: input values
- Range: output values

LINEAR FUNCTIONS
- Form: y = mx + b
- m = slope, b = y-intercept

QUADRATIC FUNCTIONS
- Form: y = ax² + bx + c
- Graph is a parabola
- Vertex shows maximum or minimum point

SEQUENCES
- Arithmetic: constant difference
- Geometric: constant ratio

EXAMPLES:
- Linear: y = 2x + 3
- Quadratic: y = x² - 4x + 3
- Arithmetic sequence: 2, 5, 8, 11...
`,
    summary: `
• Functions map inputs to outputs  
• Linear functions: straight line  
• Quadratic functions: parabola  
• Sequences follow arithmetic or geometric patterns
`,
    video: "https://www.youtube.com/results?search_query=general+mathematics+grade+11",
    quiz: [
      {
        question: "What is the graph of a quadratic function?",
        choices: ["Line", "Circle", "Parabola", "Triangle"],
        answer: 2,
        explanation: "Quadratic functions always form a parabola."
      }
    ]
  },

  // 4. Pre-Calculus
  preCalc: {
    title: "Pre-Calculus",
    lesson: `
Pre-Calculus prepares students for Calculus with algebra and trigonometry skills.

TRIGONOMETRY
- sin θ = opposite / hypotenuse
- cos θ = adjacent / hypotenuse
- tan θ = opposite / adjacent

UNIT CIRCLE
- Defines sine and cosine for all angles
- Positive and negative values based on quadrant

EXAMPLES:
- sin 30° = 1/2
- cos 60° = 1/2
- tan 45° = 1
`,
    summary: `
• Trigonometry relates angles and sides  
• Unit circle defines trig values for all angles  
• Prepares for Calculus
`,
    video: "https://www.youtube.com/results?search_query=precalculus+grade+11",
    quiz: [
      {
        question: "What is sin 90°?",
        choices: ["0", "0.5", "1", "-1"],
        answer: 2,
        explanation: "The sine of 90 degrees is 1."
      }
    ]
  },

  // 5. Earth Science
  earthSci: {
    title: "Earth Science",
    lesson: `
Earth Science studies Earth’s structure, processes, and systems.

LAYERS OF THE EARTH
- Crust: outer layer
- Mantle: semi-molten layer
- Core: inner and outer core

PLATE TECTONICS
- Plate movements cause earthquakes, volcanoes, mountains

ROCKS
- Igneous, Sedimentary, Metamorphic

EXAMPLES:
- Ring of Fire earthquakes
- Formation of Himalayas
`,
    summary: `
• Earth has crust, mantle, core  
• Plate movement causes earthquakes  
• Rocks are igneous, sedimentary, metamorphic
`,
    video: "https://www.youtube.com/results?search_query=earth+science+grade+11",
    quiz: [
      {
        question: "Which layer is the hottest?",
        choices: ["Crust", "Mantle", "Core", "Atmosphere"],
        answer: 2,
        explanation: "The core is the hottest layer of the Earth."
      }
    ]
  },

  // 6. General Chemistry 1
  genChem: {
    title: "General Chemistry 1",
    lesson: `
General Chemistry studies matter and its behavior.

MATTER
- Solid, Liquid, Gas

ATOMIC STRUCTURE
- Protons, Neutrons, Electrons

PERIODIC TABLE
- Organizes elements by properties and atomic number

EXAMPLES:
- H₂O is a compound
- Na is an element
`,
    summary: `
• Matter exists in three states  
• Atoms compose matter  
• Periodic table organizes elements
`,
    video: "https://www.youtube.com/results?search_query=general+chemistry+grade+11",
    quiz: [
      {
        question: "What is H₂O?",
        choices: ["Element", "Compound", "Mixture", "Solution"],
        answer: 1,
        explanation: "H₂O is a compound made of hydrogen and oxygen."
      }
    ]
  },

  // 7. Physical Education and Health
  physEd: {
    title: "Physical Education and Health",
    lesson: `
Promotes physical fitness and healthy living.

FITNESS COMPONENTS
- Cardiovascular endurance
- Strength
- Flexibility

HEALTH
- Nutrition
- Mental health
- Lifestyle choices

EXAMPLES:
- Jogging for endurance
- Stretching for flexibility
- Balanced diet
`,
    summary: `
• Fitness improves health  
• Nutrition supports performance  
• Physical activity is essential
`,
    video: "https://www.youtube.com/results?search_query=physical+education+grade+11",
    quiz: [
      {
        question: "Which is a fitness component?",
        choices: ["Reading", "Strength", "Writing", "Sleeping"],
        answer: 1,
        explanation: "Strength is a core component of physical fitness."
      }
    ]
  },

  // 8. Empowerment Technologies
  empTech: {
    title: "Empowerment Technologies",
    lesson: `
Focuses on digital tools for productivity and communication.

TOPICS
- Word processing
- Spreadsheets
- Presentations
- Internet safety
- Basic web development

EXAMPLES:
- Writing reports in Word
- Calculations in Excel
- Creating slides in PowerPoint
`,
    summary: `
• Uses digital tools for productivity  
• Promotes digital citizenship  
• Introduces basic web tools
`,
    video: "https://www.youtube.com/results?search_query=empowerment+technologies+grade+11",
    quiz: [
      {
        question: "Which tool is used for calculations?",
        choices: ["Word", "Excel", "PowerPoint", "Paint"],
        answer: 1,
        explanation: "Excel is used for calculations and data analysis."
      }
    ]
  }

};
