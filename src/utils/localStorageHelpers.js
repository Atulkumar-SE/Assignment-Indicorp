// Keys for localStorage
const KEYS = {
  MECHANICS: 'tims_mechanics',
  TOOLS: 'tims_tools',
  ISSUES: 'tims_issues',
  SESSION: 'tims_session'
};

// Seed initial data if not present
export const seedInitialData = () => {
  // 1. Seed Mechanics
  if (!localStorage.getItem(KEYS.MECHANICS)) {
    const defaultMechanics = [
      {
        id: 'mech-1',
        fullName: 'John Doe',
        email: 'john@gmail.com',
        mobile: '9876543210',
        level: 'Expert',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
        passwordHash: 'Password@123', // Admin password matches criteria, let's have a standard test password
        createdAt: new Date().toISOString()
      },
      {
        id: 'mech-2',
        fullName: 'Alex Smith',
        email: 'alex@gmail.com',
        mobile: '9887766554',
        level: 'Medium',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        passwordHash: 'Password@123',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(KEYS.MECHANICS, JSON.stringify(defaultMechanics));
  }

  // 2. Seed Tools
  if (!localStorage.getItem(KEYS.TOOLS)) {
    const defaultTools = [
      {
        id: 'tool-1',
        toolName: 'Bosch Professional Cordless Drill',
        category: 'Drill Machine',
        inventoryNumber: 'TL-DRIL-001',
        quantity: 5,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tool-2',
        toolName: 'Stanley Claw Hammer 16oz',
        category: 'Hammer',
        inventoryNumber: 'TL-HAMR-001',
        quantity: 10,
        image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tool-3',
        toolName: 'Snap-on 10-inch Adjustable Wrench',
        category: 'Wrench',
        inventoryNumber: 'TL-WRNC-001',
        quantity: 8,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tool-4',
        toolName: 'Craftsman Multi-Bit Screwdriver Set',
        category: 'Screwdriver',
        inventoryNumber: 'TL-SCRW-001',
        quantity: 15,
        image: 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tool-5',
        toolName: 'Knipex High Leverage Combination Pliers',
        category: 'Plier',
        inventoryNumber: 'TL-PLIR-001',
        quantity: 12,
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=300'
      }
    ];
    localStorage.setItem(KEYS.TOOLS, JSON.stringify(defaultTools));
  }

  // 3. Seed Issues (Empty array if not exists)
  if (!localStorage.getItem(KEYS.ISSUES)) {
    const defaultIssues = [
      {
        id: 'issue-1',
        toolId: 'tool-2',
        toolName: 'Stanley Claw Hammer 16oz',
        mechanicId: 'mech-1',
        mechanicName: 'John Doe',
        issueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        returnDate: null,
        quantityIssued: 1,
        status: 'Issued'
      },
      {
        id: 'issue-2',
        toolId: 'tool-4',
        toolName: 'Craftsman Multi-Bit Screwdriver Set',
        mechanicId: 'mech-2',
        mechanicName: 'Alex Smith',
        issueDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        returnDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
        quantityIssued: 2,
        status: 'Returned'
      }
    ];
    localStorage.setItem(KEYS.ISSUES, JSON.stringify(defaultIssues));

    // Update tool counts based on active issues
    // For issue-1, John Doe has active issue of tool-2 (1 unit)
    const tools = JSON.parse(localStorage.getItem(KEYS.TOOLS) || '[]');
    const hammer = tools.find(t => t.id === 'tool-2');
    if (hammer && hammer.quantity > 0) {
      hammer.quantity -= 1;
      localStorage.setItem(KEYS.TOOLS, JSON.stringify(tools));
    }
  }
};

// --- MECHANIC HELPERS ---
export const getMechanics = () => {
  seedInitialData();
  return JSON.parse(localStorage.getItem(KEYS.MECHANICS) || '[]');
};

export const saveMechanic = (mechanic) => {
  const mechanics = getMechanics();
  const newMechanic = {
    id: `mech-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...mechanic
  };
  mechanics.push(newMechanic);
  localStorage.setItem(KEYS.MECHANICS, JSON.stringify(mechanics));
  return newMechanic;
};

// --- TOOL HELPERS ---
export const getTools = () => {
  seedInitialData();
  return JSON.parse(localStorage.getItem(KEYS.TOOLS) || '[]');
};

export const saveTool = (tool) => {
  const tools = getTools();
  if (tool.id) {
    // Edit existing tool
    const index = tools.findIndex(t => t.id === tool.id);
    if (index !== -1) {
      tools[index] = { ...tools[index], ...tool };
    }
  } else {
    // Create new tool
    const newTool = {
      id: `tool-${Date.now()}`,
      ...tool,
      quantity: Number(tool.quantity)
    };
    tools.push(newTool);
    localStorage.setItem(KEYS.TOOLS, JSON.stringify(tools));
    return newTool;
  }
  localStorage.setItem(KEYS.TOOLS, JSON.stringify(tools));
  return tool;
};

export const deleteTool = (toolId) => {
  const tools = getTools();
  const filtered = tools.filter(t => t.id !== toolId);
  localStorage.setItem(KEYS.TOOLS, JSON.stringify(filtered));
  return true;
};

// --- ISSUE RECORD HELPERS ---
export const getIssues = () => {
  seedInitialData();
  return JSON.parse(localStorage.getItem(KEYS.ISSUES) || '[]');
};

export const issueTool = (toolId, quantity, mechanicId, mechanicName) => {
  const tools = getTools();
  const toolIndex = tools.findIndex(t => t.id === toolId);
  
  if (toolIndex === -1) throw new Error('Tool not found');
  if (tools[toolIndex].quantity < quantity) throw new Error('Insufficient quantity in stock');
  
  // Deduct tool quantity
  tools[toolIndex].quantity -= Number(quantity);
  localStorage.setItem(KEYS.TOOLS, JSON.stringify(tools));
  
  // Log issue
  const issues = getIssues();
  const newIssue = {
    id: `issue-${Date.now()}`,
    toolId,
    toolName: tools[toolIndex].toolName,
    mechanicId,
    mechanicName,
    issueDate: new Date().toISOString(),
    returnDate: null,
    quantityIssued: Number(quantity),
    status: 'Issued'
  };
  issues.unshift(newIssue); // add at start
  localStorage.setItem(KEYS.ISSUES, JSON.stringify(issues));
  return newIssue;
};

export const returnTool = (issueId) => {
  const issues = getIssues();
  const issueIndex = issues.findIndex(i => i.id === issueId);
  
  if (issueIndex === -1) throw new Error('Issue record not found');
  if (issues[issueIndex].status === 'Returned') throw new Error('Tool is already returned');
  
  // Update status & return date
  issues[issueIndex].status = 'Returned';
  issues[issueIndex].returnDate = new Date().toISOString();
  
  // Re-add quantity to stock
  const tools = getTools();
  const toolIndex = tools.findIndex(t => t.id === issues[issueIndex].toolId);
  if (toolIndex !== -1) {
    tools[toolIndex].quantity += Number(issues[issueIndex].quantityIssued);
    localStorage.setItem(KEYS.TOOLS, JSON.stringify(tools));
  }
  
  localStorage.setItem(KEYS.ISSUES, JSON.stringify(issues));
  return issues[issueIndex];
};

// --- USER SESSION HELPERS ---
export const getCurrentSession = () => {
  const session = localStorage.getItem(KEYS.SESSION);
  return session ? JSON.parse(session) : null;
};

export const loginUser = (user, role) => {
  const sessionData = {
    ...user,
    role, // 'admin' or 'mechanic'
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(KEYS.SESSION, JSON.stringify(sessionData));
  return sessionData;
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.SESSION);
  return true;
};
