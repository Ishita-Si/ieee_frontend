// Team data structure - removed faculty counselor, keeping only photos, name, position
export const teamData = {
  executive: {
    chair: {
      name: "Kunal Kumar",
      position: "Chairperson",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/images/kunal kumar.png",
      bio: "Leading the IEEE Student Branch with vision and dedication.",
      journey: "As the Chairperson of IEEE Student Branch, I oversee all operations and strategic planning."
    },
    viceChair: {
      name: "Jay Kumar Sinha",
      position: "Vice Chairperson",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/team/jay-kumar-sinha.jpg",
      bio: "Supporting the Chairperson in leading the branch forward.",
      journey: "Working closely with the Chairperson to ensure smooth operations."
    },
    secretaries: [
      {
        name: "Anandsagar Sanjay Gaikwad",
        position: "Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/anandsagar-gaikwad.jpg",
        bio: "Managing branch documentation and communications.",
        journey: "Handling all secretarial duties and maintaining records."
      },
      {
        name: "Chhavi Bhatt",
        position: "Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/chhavi-bhatt.jpg",
        bio: "Co-managing branch documentation and communications.",
        journey: "Working alongside the team to maintain organizational efficiency."
      }
    ],
    treasurer: {
      name: "Karan Pratap Singh",
      position: "Treasurer",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/team/karan-pratap-singh.jpg",
      bio: "Managing branch finances and budget planning.",
      journey: "Ensuring financial transparency and efficient resource allocation."
    }
  },
  webDesignTeam: {
    webmasters: [
      {
        name: "Aditya Bhattacharya",
        position: "Web Master",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/aditya-bhattacharya.jpg",
        bio: "Leading web development and technical infrastructure.",
        journey: "Building and maintaining the IEEE website and digital presence."
      },
      {
        name: "Vaibhav",
        position: "Web Master",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/vaibhav.jpg",
        bio: "Co-leading web development initiatives.",
        journey: "Working on frontend and backend development for IEEE platforms."
      }
    ],
    graphicDesigners: []
  },
  technicalTeam: {
    csSecretary: {
      name: "Aditya Bhattacharya",
      position: "CS Secretary",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/team/aditya-bhattacharya.jpg",
      bio: "Leading Computer Society initiatives.",
      journey: "Organizing CS-related events and technical sessions."
    },
    csViceSecretaries: [
      {
        name: "Vaibhav",
        position: "CS Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/vaibhav.jpg",
        bio: "Supporting CS initiatives and events.",
        journey: "Assisting in organizing technical workshops and competitions."
      }
    ],
    rasSecretary: {
      name: "Akhileshwar Pratap Singh",
      position: "RAS Secretary",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/team/akhileshwar-singh.jpg",
      bio: "Leading Robotics and Automation Society activities.",
      journey: "Organizing robotics workshops, competitions, and technical sessions."
    },
    rasViceSecretaries: [
      {
        name: "Raushan Kumar",
        position: "RAS Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/raushan-kumar.jpg",
        bio: "Supporting RAS initiatives and robotics events.",
        journey: "Helping organize robotics competitions and technical workshops."
      },
      {
        name: "Rishabh Tomar",
        position: "RAS Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/rishabh-tomar.jpg",
        bio: "Co-supporting RAS activities and events.",
        journey: "Working on robotics projects and technical sessions."
      }
    ],
    wieSecretary: {
      name: "Gauri Maurya",
      position: "WIE Secretary",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/team/gauri-maurya.jpg",
      bio: "Leading Women in Engineering initiatives.",
      journey: "Promoting diversity and organizing WIE events and mentorship programs."
    },
    wieViceSecretaries: [
      {
        name: "Maanvi Mishra",
        position: "WIE Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/maanvi-mishra.jpg",
        bio: "Supporting WIE initiatives and events.",
        journey: "Helping organize WIE workshops and networking events."
      },
      {
        name: "Anshita Singh",
        position: "WIE Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/anshita-singh.jpg",
        bio: "Co-supporting WIE activities.",
        journey: "Working on WIE mentorship and outreach programs."
      }
    ],
    comsocSecretary: {
      name: "Shivam Chaturvedi",
      position: "COMSOC Secretary",
      linkedin: "",
      github: "",
      instagram: "",
      image: "/team/shivam-chaturvedi.jpg",
      bio: "Leading Communications Society activities.",
      journey: "Organizing COMSOC events, workshops, and technical sessions."
    },
    comsocViceSecretaries: [
      {
        name: "Prabhat Kushwaha",
        position: "COMSOC Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/prabhat-kushwaha.jpg",
        bio: "Supporting COMSOC initiatives.",
        journey: "Helping organize communications-related events and workshops."
      },
      {
        name: "Mouli",
        position: "COMSOC Vice-Secretary",
        linkedin: "",
      github: "",
      instagram: "",
        image: "/team/mouli.jpg",
        bio: "Co-supporting COMSOC activities.",
        journey: "Working on COMSOC projects and technical sessions."
      }
    ]
  },
  // New designations - these will be populated from backend
  newDesignations: {
    jointSec: [], // Joint_Sec
    design: [], // Design
    audit: [], // Audit
    editorial: [], // Editorial
    wie: [], // WIE
    comsoc: [], // ComSoc
    ras: [], // RAS
    cs: [], // CS
    event: [], // EVENT
    cnm: [], // CNM
    members: [] // Additional Members
  },
  generalMembers: []
};

// Helper function to generate slug from name
export const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Helper function to get member by slug
export const getMemberBySlug = (slug) => {
  const allMembers = [];
  
  // Executive Team
  if (teamData.executive.chair) {
    allMembers.push({ ...teamData.executive.chair, slug: generateSlug(teamData.executive.chair.name) });
  }
  if (teamData.executive.viceChair) {
    allMembers.push({ ...teamData.executive.viceChair, slug: generateSlug(teamData.executive.viceChair.name) });
  }
  teamData.executive.secretaries.forEach((sec) => {
    allMembers.push({ ...sec, slug: generateSlug(sec.name) });
  });
  if (teamData.executive.treasurer) {
    allMembers.push({ ...teamData.executive.treasurer, slug: generateSlug(teamData.executive.treasurer.name) });
  }
  
  // Web & Design Team
  teamData.webDesignTeam.webmasters.forEach((wm) => {
    const slug = generateSlug(wm.name);
    if (wm.name === 'Aditya Bhattacharya' && wm.position === 'Web Master') {
      allMembers.push({ ...wm, slug: slug + '-webmaster' });
    } else {
      allMembers.push({ ...wm, slug });
    }
  });
  
  // Technical Team
  if (teamData.technicalTeam.csSecretary) {
    allMembers.push({ ...teamData.technicalTeam.csSecretary, slug: generateSlug(teamData.technicalTeam.csSecretary.name) + '-cs' });
  }
  teamData.technicalTeam.csViceSecretaries.forEach((vsec) => {
    allMembers.push({ ...vsec, slug: generateSlug(vsec.name) + '-cs' });
  });
  if (teamData.technicalTeam.rasSecretary) {
    allMembers.push({ ...teamData.technicalTeam.rasSecretary, slug: generateSlug(teamData.technicalTeam.rasSecretary.name) });
  }
  teamData.technicalTeam.rasViceSecretaries.forEach((vsec) => {
    allMembers.push({ ...vsec, slug: generateSlug(vsec.name) });
  });
  if (teamData.technicalTeam.wieSecretary) {
    allMembers.push({ ...teamData.technicalTeam.wieSecretary, slug: generateSlug(teamData.technicalTeam.wieSecretary.name) });
  }
  teamData.technicalTeam.wieViceSecretaries.forEach((vsec) => {
    allMembers.push({ ...vsec, slug: generateSlug(vsec.name) });
  });
  if (teamData.technicalTeam.comsocSecretary) {
    allMembers.push({ ...teamData.technicalTeam.comsocSecretary, slug: generateSlug(teamData.technicalTeam.comsocSecretary.name) });
  }
  teamData.technicalTeam.comsocViceSecretaries.forEach((vsec) => {
    allMembers.push({ ...vsec, slug: generateSlug(vsec.name) });
  });
  
  return allMembers.find(m => m.slug === slug) || null;
};
