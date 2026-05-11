// Achievements data structure - redesigned with organization, purpose, winners
export const achievementsData = [
  {
    id: '1',
    title: 'CODEQUEST 2024',
    category: 'Competition',
    date: 'November 2024',
    why: 'To foster competitive programming culture among students and provide a platform for showcasing coding skills. We aimed to bridge the gap between academic learning and practical problem-solving while preparing students for technical interviews and competitive programming platforms.',
    how: 'The event was organized in three phases: planning (2 months), promotion (1 month), and execution. We collaborated with HackerRank for the platform, created problem sets covering algorithms, data structures, and dynamic programming. Registration was done through our website, and participants were divided into preliminary and final rounds. The competition ran for 6 hours with real-time leaderboard updates.',
    winners: [
      { position: '1st', name: 'Rajesh Kumar', rollNo: '22CS3015', prize: '₹10,000 + TECHFEST Entry' },
      { position: '2nd', name: 'Priya Sharma', rollNo: '22EC3020', prize: '₹5,000' },
      { position: '3rd', name: 'Amit Singh', rollNo: '23CS3005', prize: '₹3,000' }
    ],
    photos: [
      '/achievements/codequest-2024-1.jpg',
      '/achievements/codequest-2024-2.jpg',
      '/achievements/codequest-2024-3.jpg'
    ],
    stats: {
      participants: 200,
      duration: '6 hours',
      problems: 8,
      platform: 'HackerRank'
    },
    team: ['Kunal Kumar', 'Jay Kumar Sinha', 'Anandsagar Gaikwad'],
    impact: 'Increased coding culture awareness among students and strengthened IEEE presence on campus. Many participants started regular practice on competitive platforms.'
  },
  {
    id: '2',
    title: 'Hack RGIPT 2024',
    category: 'Hackathon',
    date: 'October 2024',
    why: 'To encourage innovation and collaborative problem-solving among students. We wanted to create an environment where students could build real-world solutions, learn new technologies, and network with peers and industry mentors. The hackathon aimed to bridge the gap between theoretical knowledge and practical application.',
    how: 'Organized as part of Urjotsav in collaboration with KODE Club. The 48-hour event started with an opening ceremony and problem statement release. Teams of 2-4 members worked on projects addressing themes like sustainability, healthcare, education, and automation. We arranged mentorship sessions with industry experts, provided food and refreshments, and created a collaborative workspace. The event concluded with project presentations and judging by a panel of faculty and industry professionals.',
    winners: [
      { position: '1st', name: 'Team Innovators', members: ['Sneha Patel', 'Rahul Verma'], prize: '₹15,000' },
      { position: '2nd', name: 'Team CodeCraft', members: ['Anjali Mehta', 'Vikram Singh'], prize: '₹8,000' },
      { position: 'Best Design', name: 'Team UI Masters', members: ['Kavya Reddy', 'Arjun Nair'], prize: '₹5,000' }
    ],
    photos: [
      '/achievements/hack-rgipt-2024-1.jpg',
      '/achievements/hack-rgipt-2024-2.jpg',
      '/achievements/hack-rgipt-2024-3.jpg'
    ],
    stats: {
      teams: 40,
      participants: 150,
      duration: '48 hours',
      projects: 20
    },
    team: ['Shivam Chaturvedi', 'Prabhat Kushwaha', 'Mouli'],
    impact: 'Fostered innovation and collaboration among students. Several projects were further developed and some teams received internship offers based on their hackathon projects.'
  },
  {
    id: '3',
    title: 'RoboQuest 2024',
    category: 'Workshop Series',
    date: 'September 2024',
    why: 'To introduce students to robotics and automation, which are crucial fields in modern engineering. Many students showed interest but lacked hands-on experience. We aimed to provide practical knowledge from basics to advanced concepts, making robotics accessible to beginners while challenging experienced participants.',
    how: 'Conducted as a 4-day intensive workshop series. Day 1-2 focused on building Line Follower robots with sensors and Arduino programming. Day 3 covered Obstacle Avoidance mechanisms using ultrasonic sensors. Day 4 featured an advanced PID Workshop for precise control. We provided all necessary components including Arduino boards, sensors, motors, and chassis. Each day included theory sessions followed by hands-on building. The series concluded with a competition where participants showcased their robots.',
    winners: [
      { position: 'Best Bot', name: 'Team RoboMasters', members: ['Aditya Kumar', 'Sakshi Gupta'], prize: '₹8,000' },
      { position: 'Most Innovative', name: 'Team AutoTech', members: ['Rohan Mehta', 'Neha Singh'], prize: '₹5,000' }
    ],
    photos: [
      '/achievements/roboquest-2024-1.jpg',
      '/achievements/roboquest-2024-2.jpg',
      '/achievements/roboquest-2024-3.jpg'
    ],
    stats: {
      participants: 100,
      duration: '4 days',
      robots: 50,
      sessions: 8
    },
    team: ['Akhileshwar Pratap Singh', 'Raushan Kumar', 'Rishabh Tomar'],
    impact: 'Introduced robotics to many students and created interest in automation and embedded systems. Several participants continued working on robotics projects independently.'
  },
  {
    id: '4',
    title: 'Web Development Workshop',
    category: 'Workshop',
    date: 'August 2024',
    why: 'To equip students with modern web development skills that are highly demanded in the industry. Many students wanted to learn full-stack development but didn\'t know where to start. We aimed to provide a comprehensive learning experience covering both frontend and backend technologies.',
    how: 'Organized as a full-day intensive workshop (8 hours). Started with fundamentals of HTML, CSS, and JavaScript, then moved to React for frontend development. Covered TypeScript for type safety, Node.js for backend, and MongoDB for database. The workshop included hands-on coding sessions where participants built a complete full-stack application with authentication and database integration. We provided deployment guidance and resources for further learning.',
    winners: [
      { position: 'Best Project', name: 'E-Commerce Platform', creator: 'Rahul Sharma', rollNo: '23CS3010', prize: '₹3,000' }
    ],
    photos: [
      '/achievements/webdev-workshop-2024-1.jpg',
      '/achievements/webdev-workshop-2024-2.jpg'
    ],
    stats: {
      participants: 50,
      duration: '8 hours',
      projects: 50,
      technologies: 5
    },
    team: ['Aditya Bhattacharya', 'Vaibhav'],
    impact: 'Equipped students with modern web development skills. Many participants secured internships and freelance projects after the workshop.'
  },
  {
    id: '5',
    title: 'Machine Learning Bootcamp',
    category: 'Workshop',
    date: 'July 2024',
    why: 'To introduce students to the rapidly growing field of AI and Machine Learning. With AI becoming integral to various industries, we wanted to provide students with foundational knowledge and hands-on experience. The bootcamp aimed to demystify ML concepts and enable students to build their own models.',
    how: 'Conducted as a 4-day intensive bootcamp covering supervised learning, neural networks, and deep learning. Day 1 covered basics of Python for ML, data preprocessing, and scikit-learn. Day 2 focused on supervised learning algorithms (regression, classification). Day 3 introduced neural networks and TensorFlow basics. Day 4 covered deep learning with hands-on projects. Participants worked on real-world datasets including image classification, sentiment analysis, and predictive modeling. Each session included theory followed by practical implementation.',
    winners: [
      { position: 'Best Model', name: 'Image Classifier', creator: 'Ananya Patel', rollNo: '22EC3018', prize: '₹5,000' }
    ],
    photos: [
      '/achievements/ml-bootcamp-2024-1.jpg',
      '/achievements/ml-bootcamp-2024-2.jpg',
      '/achievements/ml-bootcamp-2024-3.jpg'
    ],
    stats: {
      participants: 40,
      duration: '4 days',
      models: 10,
      datasets: 5
    },
    team: ['Gauri Maurya', 'Maanvi Mishra', 'Anshita Singh'],
    impact: 'Created awareness about AI/ML and helped students start their journey in machine learning. Several participants published their projects on GitHub and Kaggle.'
  },
  {
    id: '6',
    title: 'IEEE Day Celebration',
    category: 'Event',
    date: 'October 2024',
    why: 'To celebrate the founding of IEEE and strengthen the community bonds among members. IEEE Day is an opportunity to showcase our achievements, connect with alumni, and inspire new members. We wanted to create a memorable event that highlights the value of IEEE membership and technical excellence.',
    how: 'Organized as a day-long celebration starting with technical talks by industry experts covering emerging technologies and career guidance. Followed by poster presentation competition where students showcased their projects. The afternoon featured networking sessions and cultural performances. The event concluded with an awards ceremony recognizing outstanding members and a networking dinner. We also set up exhibition booths showcasing IEEE activities and achievements.',
    winners: [
      { position: 'Best Poster', name: 'Smart Energy Management', creator: 'Team GreenTech', prize: 'Certificate + Trophy' },
      { position: 'Outstanding Member', name: 'Kunal Kumar', prize: 'Certificate + Recognition' }
    ],
    photos: [
      '/achievements/ieee-day-2024-1.jpg',
      '/achievements/ieee-day-2024-2.jpg',
      '/achievements/ieee-day-2024-3.jpg',
      '/achievements/ieee-day-2024-4.jpg'
    ],
    stats: {
      attendees: 200,
      talks: 5,
      posters: 25,
      duration: '1 day'
    },
    team: ['All Executive Members'],
    impact: 'Strengthened IEEE community bonds and increased visibility of IEEE activities on campus. Many new students expressed interest in joining IEEE.'
  }
];

// Helper functions
export const getAchievementById = (id) => {
  return achievementsData.find(achievement => achievement.id === id);
};

export const getAchievementsByCategory = (category) => {
  return achievementsData.filter(achievement => achievement.category === category);
};

export const getCategories = () => {
  const categories = [...new Set(achievementsData.map(a => a.category))];
  return categories;
};
